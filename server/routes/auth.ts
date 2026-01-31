import { Router } from 'express';
import * as auth from '../services/auth.js';
import type { Request, Response } from 'express';

const router = Router();

// Mock Google Sign-In (simulates OAuth flow)
router.post('/google', (req: Request, res: Response) => {
    const { email, name, avatarUrl } = req.body;

    if (!email || !name) {
        return res.status(400).json({ error: 'Email and name are required' });
    }

    try {
        const user = auth.createOrGetUser(email, name, avatarUrl);
        const session = auth.createSession(user.id);

        // Set session cookie
        res.cookie('session', session.sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: session.expiresAt,
        });

        return res.json({ user, expiresAt: session.expiresAt });
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(500).json({ error: 'Authentication failed' });
    }
});

// Get current user (from session)
router.get('/me', (req: Request, res: Response) => {
    const sessionId = req.cookies?.session;

    if (!sessionId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = auth.validateSession(sessionId);

    if (!user) {
        res.clearCookie('session');
        return res.status(401).json({ error: 'Session expired or invalid' });
    }

    return res.json({ user });
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
    const sessionId = req.cookies?.session;

    if (sessionId) {
        auth.deleteSession(sessionId);
    }

    res.clearCookie('session');
    return res.json({ success: true });
});

// Update profile
router.patch('/profile', (req: Request, res: Response) => {
    const sessionId = req.cookies?.session;

    if (!sessionId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = auth.validateSession(sessionId);
    if (!user) {
        res.clearCookie('session');
        return res.status(401).json({ error: 'Session expired' });
    }

    const { name, avatarUrl } = req.body;
    const updated = auth.updateUser(user.id, { name, avatarUrl });

    if (!updated) {
        return res.status(400).json({ error: 'No changes made' });
    }

    const updatedUser = auth.getUserById(user.id);
    return res.json({ user: updatedUser });
});

export default router;
