import { Router } from 'express';
import * as activities from '../services/activities.js';
import * as auth from '../services/auth.js';
import type { Request, Response } from 'express';
import { validate } from '../middleware/security.js';
import { createActivitySchema } from '../schemas/index.js';

const router = Router();

// Get recent activities
router.get('/', async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 20;

    try {
        const recentActivities = await activities.getRecentActivities(Math.min(limit, 100));
        return res.json({ activities: recentActivities });
    } catch (error) {
        console.error('Error fetching activities:', error);
        return res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

// Get activities by room
router.get('/room/:roomId', async (req: Request, res: Response) => {
    const roomId = req.params.roomId as string;
    const limit = parseInt(req.query.limit as string) || 50;

    try {
        const roomActivities = await activities.getActivitiesByRoom(roomId, Math.min(limit, 100));
        return res.json({ activities: roomActivities });
    } catch (error) {
        console.error('Error fetching activities:', error);
        return res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

// Create new activity (requires auth)
router.post('/', validate(createActivitySchema), async (req: Request, res: Response) => {
    const sessionId = req.cookies?.session;

    if (!sessionId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const user = await auth.validateSession(sessionId);
        if (!user) {
            res.clearCookie('session');
            return res.status(401).json({ error: 'Session expired' });
        }

        const { action, roomId, roomName } = req.body;

        // Zod validation handles action existence check

        const activity = await activities.createActivity(user.id, user.name, action, roomId, roomName);
        return res.status(201).json({ activity });
    } catch (error) {
        console.error('Error creating activity:', error);
        return res.status(500).json({ error: 'Failed to create activity' });
    }
});

// Get my activities
router.get('/me', async (req: Request, res: Response) => {
    const sessionId = req.cookies?.session;

    if (!sessionId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const user = await auth.validateSession(sessionId);
        if (!user) {
            res.clearCookie('session');
            return res.status(401).json({ error: 'Session expired' });
        }

        const limit = parseInt(req.query.limit as string) || 50;
        const myActivities = await activities.getActivitiesByUser(user.id, Math.min(limit, 100));
        return res.json({ activities: myActivities });
    } catch (error) {
        console.error('Error fetching activities:', error);
        return res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

export default router;
