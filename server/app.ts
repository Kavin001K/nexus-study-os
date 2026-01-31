import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase } from './db/database.js';
import { cleanupExpiredSessions } from './services/auth.js';
import { cleanupOldActivities } from './services/activities.js';

// Routes
import authRoutes from './routes/auth.js';
import nodesRoutes from './routes/nodes.js';
import roomsRoutes from './routes/rooms.js';
import activitiesRoutes from './routes/activities.js';

import { apiLimiter, securityHeaders } from './middleware/security.js';

const app = express();

// Initialize database is now handled in server/index.ts

// Middleware
app.use(securityHeaders);
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:5173', 'http://[::]:8080', 'https://nexus-lzjp.onrender.com'],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Request logging (development)
app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/nodes', nodesRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/activities', activitiesRoutes);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: process.env.DATABASE_URL ? 'postgres' : 'sqlite',
        mode: process.env.NODE_ENV || 'development'
    });
});

// Error handling
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Serve static files in production
const DIST_PATH = path.join(process.cwd(), 'dist');

if (process.env.NODE_ENV === 'production' || process.env.SERVE_STATIC === 'true') {
    app.use(express.static(DIST_PATH));
}

// 404 handler (API only)
app.use('/api/*', (_req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// SPA Fallback - serve index.html for any other route
if (process.env.NODE_ENV === 'production' || process.env.SERVE_STATIC === 'true') {
    app.get('*', (_req, res) => {
        res.sendFile(path.join(DIST_PATH, 'index.html'));
    });
}

// Cleanup tasks are now managed by server/cron.ts

export default app;
