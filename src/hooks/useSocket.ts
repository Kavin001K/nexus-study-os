import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppStore } from '@/store/useAppStore';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ActivityItem, KnowledgeNode } from '@/lib/api';

const SOCKET_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/' : 'http://localhost:3001');

export const useSocket = () => {
    const socket = useRef<Socket | null>(null);
    const user = useAppStore((state) => state.user);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!user) {
            if (socket.current) {
                socket.current.disconnect();
                socket.current = null;
            }
            return;
        }

        if (socket.current?.connected) return;

        socket.current = io(SOCKET_URL, {
            auth: { userId: user.id },
            withCredentials: true,
            transports: ['websocket', 'polling'],
        });

        socket.current.on('connect', () => {
            console.log('Socket connected:', socket.current?.id);
        });

        socket.current.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        // Listen for global activities
        socket.current.on('activity:feed_update', (newActivity: ActivityItem) => {
            // Update Activities Cache
            queryClient.setQueryData(['activities', 20], (oldData: ActivityItem[] | undefined) => {
                const currentList = oldData || [];
                return [newActivity, ...currentList].slice(0, 50);
            });
            toast.info(`New activity: ${newActivity.action} by ${newActivity.user}`);
        });

        // Listen for collaborative graph movements
        socket.current.on('node:moved', ({ nodeId, position }: { nodeId: string, position: [number, number, number] }) => {
            queryClient.setQueryData(['nodes'], (oldNodes: KnowledgeNode[] | undefined) => {
                if (!oldNodes) return [];
                return oldNodes.map(node => node.id === nodeId ? { ...node, position } : node);
            });
        });

        return () => {
            if (socket.current) {
                socket.current.disconnect();
                socket.current = null;
            }
        };
    }, [user, queryClient]);

    return socket.current;
};
