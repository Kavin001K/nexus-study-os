import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';

const PORT = process.env.PORT || 3001;
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: [
            'http://localhost:8080',
            'http://localhost:5173',
            'http://[::]:8080',
            'https://nexus-lzjp.onrender.com',
            process.env.CLIENT_URL || ''
        ].filter(Boolean),
        credentials: true
    }
});

// Store active users mapped to socket IDs
// In production with multiple instances, use Redis Adapter
const activeUsers = new Map<string, string>();

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Authentication Handshake (Simplified)
    // Client should send { auth: { userId: '...' } }
    const userId = socket.handshake.auth.userId as string | undefined;

    if (userId) {
        activeUsers.set(userId, socket.id);
        socket.join(`user:${userId}`); // Personal channel

        // Broadcast online status
        socket.broadcast.emit('presence:update', { userId, status: 'online' });
        console.log(`User ${userId} is online`);
    }

    // Room Logic
    socket.on('room:join', (roomId) => {
        socket.join(`room:${roomId}`);
        console.log(`User ${userId || socket.id} joined room ${roomId}`);
        if (userId) {
            socket.to(`room:${roomId}`).emit('room:user_joined', { userId });
        }
    });

    socket.on('room:leave', (roomId) => {
        socket.leave(`room:${roomId}`);
        console.log(`User ${userId || socket.id} left room ${roomId}`);
        if (userId) {
            socket.to(`room:${roomId}`).emit('room:user_left', { userId });
        }
    });

    // Real-time Activity Feed
    socket.on('activity:new', (activityData) => {
        // Broadcast to everyone
        // In future: broadcast only to relevant rooms/users
        socket.broadcast.emit('activity:feed_update', activityData);
    });

    // Collaborative Graph Modeling
    socket.on('node:move', (data) => {
        // Broadcast node position updates to everyone except sender
        socket.broadcast.emit('node:moved', data);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        if (userId) {
            activeUsers.delete(userId);
            io.emit('presence:update', { userId, status: 'offline' });
        }
    });
});

import { initializeDatabase } from './db/index.js';
import { startCleanupTasks } from './cron.js';

const startServer = async () => {
    try {
        await initializeDatabase();

        httpServer.listen(PORT, () => {
            const dbType = process.env.DATABASE_URL ? 'PostgreSQL' : 'SQLite';
            console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    🚀 Nexus Study OS API                       ║
║                ⚡ Real-Time Server Active ⚡                   ║
╠═══════════════════════════════════════════════════════════════╣
║  Server running at http://localhost:${PORT}                      ║
║  Database: ${dbType.padEnd(51)}║
║  Mode: ${(process.env.NODE_ENV || 'development').padEnd(51)}║
╚═══════════════════════════════════════════════════════════════╝
            `);

            // Start background tasks
            startCleanupTasks();
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
