import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nodesApi, roomsApi, activitiesApi } from '@/lib/api';
import type { KnowledgeNode, GoalRoom, ActivityItem } from '@/lib/api';

// --- Nodes Queries ---

export const useNodes = () => {
    return useQuery({
        queryKey: ['nodes'],
        queryFn: async () => {
            const { data } = await nodesApi.getAll();
            return data?.nodes || [];
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useUpdateNodeStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: 'green' | 'yellow' | 'red' }) =>
            nodesApi.updateStatus(id, status),
        // Optimistic Update
        onMutate: async ({ id, status }) => {
            await queryClient.cancelQueries({ queryKey: ['nodes'] });
            const previousNodes = queryClient.getQueryData<KnowledgeNode[]>(['nodes']);

            if (previousNodes) {
                queryClient.setQueryData(['nodes'],
                    previousNodes.map(node => node.id === id ? { ...node, status } : node)
                );
            }

            return { previousNodes };
        },
        onError: (_err, _newTodo, context) => {
            if (context?.previousNodes) {
                queryClient.setQueryData(['nodes'], context.previousNodes);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['nodes'] });
        }
    });
};

// --- Rooms Queries ---

export const useRooms = () => {
    return useQuery({
        queryKey: ['rooms'],
        queryFn: async () => {
            const { data } = await roomsApi.getAll();
            return data?.rooms || [];
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
};

export const useJoinRoom = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (roomId: string) => roomsApi.join(roomId),
        onMutate: async (roomId) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['rooms'] });

            // Snapshot the previous value
            const previousRooms = queryClient.getQueryData<GoalRoom[]>(['rooms']);

            // Optimistically update
            if (previousRooms) {
                queryClient.setQueryData<GoalRoom[]>(['rooms'], (old) => {
                    return old?.map(r => r.id === roomId ? { ...r, memberCount: r.memberCount + 1 } : r) || [];
                });
            }

            // Return a context object with the snapshotted value
            return { previousRooms };
        },
        onError: (_err, _variables, context) => {
            // Rollback on error
            if (context?.previousRooms) {
                queryClient.setQueryData(['rooms'], context.previousRooms);
            }
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        }
    });
};

export const useLeaveRoom = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (roomId: string) => roomsApi.leave(roomId),
        onMutate: async (roomId) => {
            await queryClient.cancelQueries({ queryKey: ['rooms'] });
            const previousRooms = queryClient.getQueryData<GoalRoom[]>(['rooms']);

            if (previousRooms) {
                queryClient.setQueryData<GoalRoom[]>(['rooms'], (old) => {
                    return old?.map(r => r.id === roomId ? { ...r, memberCount: Math.max(0, r.memberCount - 1) } : r) || [];
                });
            }

            return { previousRooms };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousRooms) {
                queryClient.setQueryData(['rooms'], context.previousRooms);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        }
    });
};

// --- Activities Queries ---

export const useActivities = (limit = 20) => {
    return useQuery({
        queryKey: ['activities', limit],
        queryFn: async () => {
            const { data } = await activitiesApi.getRecent(limit);
            return data?.activities || [];
        },
        refetchInterval: 1000 * 30, // Fallback polling every 30s in case socket fails
    });
};
