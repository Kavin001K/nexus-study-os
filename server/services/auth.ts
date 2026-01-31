import db, { generateId } from '../db/database.js';
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
    created_at: string;
}

interface DBSession {
    id: string;
    user_id: string;
    expires_at: string;
}

// Generate a secure session token
function generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

// Create or get user by email (for mock Google auth)
export function createOrGetUser(email: string, name: string, avatarUrl?: string): User {
    let user = db.prepare(`
    SELECT id, email, name, avatar_url, created_at FROM users WHERE email = ?
  `).get(email) as DBUser | undefined;

    if (!user) {
        const id = generateId();
        db.prepare(`
      INSERT INTO users (id, email, name, avatar_url) VALUES (?, ?, ?, ?)
    `).run(id, email, name, avatarUrl || null);

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
export function createSession(userId: string): { sessionId: string; expiresAt: Date } {
    const sessionId = generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    db.prepare(`
    INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)
  `).run(sessionId, userId, expiresAt.toISOString());

    return { sessionId, expiresAt };
}

// Validate session and get user
export function validateSession(sessionId: string): User | null {
    const session = db.prepare(`
    SELECT id, user_id, expires_at FROM sessions WHERE id = ?
  `).get(sessionId) as DBSession | undefined;

    if (!session) return null;

    const expiresAt = new Date(session.expires_at);
    if (expiresAt < new Date()) {
        // Session expired, delete it
        db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
        return null;
    }

    const user = db.prepare(`
    SELECT id, email, name, avatar_url, created_at FROM users WHERE id = ?
  `).get(session.user_id) as DBUser | undefined;

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
export function deleteSession(sessionId: string): boolean {
    const result = db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
    return result.changes > 0;
}

// Delete all sessions for a user
export function deleteAllUserSessions(userId: string): number {
    const result = db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
    return result.changes;
}

// Cleanup expired sessions
export function cleanupExpiredSessions(): number {
    const result = db.prepare(`
    DELETE FROM sessions WHERE expires_at < datetime('now')
  `).run();
    return result.changes;
}

// Get user by ID
export function getUserById(id: string): User | null {
    const user = db.prepare(`
    SELECT id, email, name, avatar_url, created_at FROM users WHERE id = ?
  `).get(id) as DBUser | undefined;

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
export function updateUser(id: string, updates: { name?: string; avatarUrl?: string }): boolean {
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

    sets.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = db.prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`).run(...values);
    return result.changes > 0;
}
