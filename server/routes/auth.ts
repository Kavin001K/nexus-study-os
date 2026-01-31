import { Router } from 'express';
import * as auth from '../services/auth.js';
import type { Request, Response } from 'express';

import { authLimiter, validate } from '../middleware/security.js';
import { loginSchema, updateProfileSchema } from '../schemas/index.js';

const router = Router();

// Mock Google Sign-In (simulates OAuth flow)
router.post('/google', authLimiter, validate(loginSchema), async (req: Request, res: Response) => {
    const { email, name, avatarUrl } = req.body;

    // Validation handled by Zod middleware

    try {
        const user = await auth.createOrGetUser(email, name, avatarUrl);
        const session = await auth.createSession(user.id);

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
router.get('/me', async (req: Request, res: Response) => {
    const sessionId = req.cookies?.session;

    if (!sessionId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const user = await auth.validateSession(sessionId);

        if (!user) {
            res.clearCookie('session');
            return res.status(401).json({ error: 'Session expired or invalid' });
        }

        return res.json({ user });
    } catch (error) {
        console.error('Session validation error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout
router.post('/logout', async (req: Request, res: Response) => {
    const sessionId = req.cookies?.session;

    if (sessionId) {
        await auth.deleteSession(sessionId);
    }

    res.clearCookie('session');
    return res.json({ success: true });
});

// Update profile
router.patch('/profile', validate(updateProfileSchema), async (req: Request, res: Response) => {
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

        const { name, avatarUrl } = req.body;
        const updated = await auth.updateUser(user.id, { name, avatarUrl });

        if (!updated) {
            return res.status(400).json({ error: 'No changes made' });
        }

        const updatedUser = await auth.getUserById(user.id);
        return res.json({ user: updatedUser });
    } catch (error) {
        console.error('Profile update error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
