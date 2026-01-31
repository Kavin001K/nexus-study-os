import { Router } from 'express';
import * as activities from '../services/activities.js';
import * as auth from '../services/auth.js';
import type { Request, Response } from 'express';

const router = Router();

// Get recent activities
router.get('/', (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 20;

    try {
        const recentActivities = activities.getRecentActivities(Math.min(limit, 100));
        return res.json({ activities: recentActivities });
    } catch (error) {
        console.error('Error fetching activities:', error);
        return res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

// Get activities by room
router.get('/room/:roomId', (req: Request, res: Response) => {
    const { roomId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    try {
        const roomActivities = activities.getActivitiesByRoom(roomId, Math.min(limit, 100));
        return res.json({ activities: roomActivities });
    } catch (error) {
        console.error('Error fetching activities:', error);
        return res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

// Create new activity (requires auth)
router.post('/', (req: Request, res: Response) => {
    const sessionId = req.cookies?.session;

    if (!sessionId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = auth.validateSession(sessionId);
    if (!user) {
        res.clearCookie('session');
        return res.status(401).json({ error: 'Session expired' });
    }

    const { action, roomId, roomName } = req.body;

    if (!action) {
        return res.status(400).json({ error: 'Action is required' });
    }

    try {
        const activity = activities.createActivity(user.id, user.name, action, roomId, roomName);
        return res.status(201).json({ activity });
    } catch (error) {
        console.error('Error creating activity:', error);
        return res.status(500).json({ error: 'Failed to create activity' });
    }
});

// Get my activities
router.get('/me', (req: Request, res: Response) => {
    const sessionId = req.cookies?.session;

    if (!sessionId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = auth.validateSession(sessionId);
    if (!user) {
        res.clearCookie('session');
        return res.status(401).json({ error: 'Session expired' });
    }

    const limit = parseInt(req.query.limit as string) || 50;

    try {
        const myActivities = activities.getActivitiesByUser(user.id, Math.min(limit, 100));
        return res.json({ activities: myActivities });
    } catch (error) {
        console.error('Error fetching activities:', error);
        return res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

export default router;
