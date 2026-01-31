import db from '../db/index.js';
import { generateId } from '../db/database.js';

export interface ActivityItem {
    id: string;
    user: string;
    action: string;
    room: string;
    timestamp: Date;
}

interface DBActivity {
    id: string;
    user_id: string;
    user_name: string;
    action: string;
    room_id: string | null;
    room_name: string | null;
    created_at: string | Date;
}

export async function getRecentActivities(limit: number = 20): Promise<ActivityItem[]> {
    const result = await db.query(`
    SELECT id, user_id, user_name, action, room_id, room_name, created_at
    FROM activities
    ORDER BY created_at DESC
    LIMIT ?
  `, [limit]);

    return result.rows.map(mapDBActivity);
}

export async function createActivity(
    userId: string,
    userName: string,
    action: string,
    roomId?: string,
    roomName?: string
): Promise<ActivityItem> {
    const id = generateId();
    const now = new Date();

    await db.query(`
    INSERT INTO activities (id, user_id, user_name, action, room_id, room_name, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [id, userId, userName, action, roomId || null, roomName || null, now.toISOString()]);

    return {
        id,
        user: userName,
        action,
        room: roomName || 'General',
        timestamp: now,
    };
}

export async function getActivitiesByUser(userId: string, limit: number = 50): Promise<ActivityItem[]> {
    const result = await db.query(`
    SELECT id, user_id, user_name, action, room_id, room_name, created_at
    FROM activities
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `, [userId, limit]);

    return result.rows.map(mapDBActivity);
}

export async function getActivitiesByRoom(roomId: string, limit: number = 50): Promise<ActivityItem[]> {
    const result = await db.query(`
    SELECT id, user_id, user_name, action, room_id, room_name, created_at
    FROM activities
    WHERE room_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `, [roomId, limit]);

    return result.rows.map(mapDBActivity);
}

// Cleanup old activities (older than 7 days)
export async function cleanupOldActivities(): Promise<number> {
    // Generate ISO string for 7 days ago to be compatible with both
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const result = await db.query(`
    DELETE FROM activities
    WHERE created_at < ?
  `, [cutoffDate]);
    return result.rowCount;
}

function mapDBActivity(activity: DBActivity): ActivityItem {
    return {
        id: activity.id,
        user: activity.user_name,
        action: activity.action,
        room: activity.room_name || 'General',
        timestamp: new Date(activity.created_at),
    };
}
