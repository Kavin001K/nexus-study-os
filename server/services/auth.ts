import db from '../db/index.js';
import { generateId } from '../db/database.js'; // Keep generating ID locally for now
import crypto from 'crypto';

export interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    createdAt: Date;
}

interface DBUser {
    id: string;
    email: string;
    name: string;
    avatar_url: string | null;
    created_at: string | Date;
}

interface DBSession {
    id: string;
    user_id: string;
    expires_at: string | Date;
}

// Generate a secure session token
function generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

// Create or get user by email (for mock Google auth)
export async function createOrGetUser(email: string, name: string, avatarUrl?: string): Promise<User> {
    let user = await db.get(`
    SELECT id, email, name, avatar_url, created_at FROM users WHERE email = ?
  `, [email]) as DBUser | undefined;

    if (!user) {
        const id = generateId();
        await db.query(`
      INSERT INTO users (id, email, name, avatar_url) VALUES (?, ?, ?, ?)
    `, [id, email, name, avatarUrl || null]);

        user = { id, email, name, avatar_url: avatarUrl || null, created_at: new Date().toISOString() };
    }

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatar_url,
        createdAt: new Date(user.created_at),
    };
}

// Create a new session
export async function createSession(userId: string): Promise<{ sessionId: string; expiresAt: Date }> {
    const sessionId = generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.query(`
    INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)
  `, [sessionId, userId, expiresAt.toISOString()]);

    return { sessionId, expiresAt };
}

// Validate session and get user
export async function validateSession(sessionId: string): Promise<User | null> {
    const session = await db.get(`
    SELECT id, user_id, expires_at FROM sessions WHERE id = ?
  `, [sessionId]) as DBSession | undefined;

    if (!session) return null;

    const expiresAt = new Date(session.expires_at);
    if (expiresAt < new Date()) {
        // Session expired, delete it
        await db.query('DELETE FROM sessions WHERE id = ?', [sessionId]);
        return null;
    }

    const user = await db.get(`
    SELECT id, email, name, avatar_url, created_at FROM users WHERE id = ?
  `, [session.user_id]) as DBUser | undefined;

    if (!user) return null;

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatar_url,
        createdAt: new Date(user.created_at),
    };
}

// Delete session (logout)
export async function deleteSession(sessionId: string): Promise<boolean> {
    const result = await db.query('DELETE FROM sessions WHERE id = ?', [sessionId]);
    return result.rowCount > 0;
}

// Delete all sessions for a user
export async function deleteAllUserSessions(userId: string): Promise<number> {
    const result = await db.query('DELETE FROM sessions WHERE user_id = ?', [userId]);
    return result.rowCount;
}

// Cleanup expired sessions
export async function cleanupExpiredSessions(): Promise<number> {
    const result = await db.query(`
    DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP
  `);
    return result.rowCount;
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
    const user = await db.get(`
    SELECT id, email, name, avatar_url, created_at FROM users WHERE id = ?
  `, [id]) as DBUser | undefined;

    if (!user) return null;

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatar_url,
        createdAt: new Date(user.created_at),
    };
}

// Update user profile
export async function updateUser(id: string, updates: { name?: string; avatarUrl?: string }): Promise<boolean> {
    const sets: string[] = [];
    const values: (string | null)[] = [];

    if (updates.name !== undefined) {
        sets.push('name = ?');
        values.push(updates.name);
    }
    if (updates.avatarUrl !== undefined) {
        sets.push('avatar_url = ?');
        values.push(updates.avatarUrl);
    }

    if (sets.length === 0) return false;

    // Use current timestamp in standard SQL
    sets.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = await db.query(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`, values);
    return result.rowCount > 0;
}
