import db, { generateId } from '../db/database.js';

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
    created_at: string;
}

export function getRecentActivities(limit: number = 20): ActivityItem[] {
    const activities = db.prepare(`
    SELECT id, user_id, user_name, action, room_id, room_name, created_at
    FROM activities
    ORDER BY created_at DESC
    LIMIT ?
  `).all(limit) as DBActivity[];

    return activities.map(activity => ({
        id: activity.id,
        user: activity.user_name,
        action: activity.action,
        room: activity.room_name || 'General',
        timestamp: new Date(activity.created_at),
    }));
}

export function createActivity(
    userId: string,
    userName: string,
    action: string,
    roomId?: string,
    roomName?: string
): ActivityItem {
    const id = generateId();
    const now = new Date();

    db.prepare(`
    INSERT INTO activities (id, user_id, user_name, action, room_id, room_name, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, userId, userName, action, roomId || null, roomName || null, now.toISOString());

    return {
        id,
        user: userName,
        action,
        room: roomName || 'General',
        timestamp: now,
    };
}

export function getActivitiesByUser(userId: string, limit: number = 50): ActivityItem[] {
    const activities = db.prepare(`
    SELECT id, user_id, user_name, action, room_id, room_name, created_at
    FROM activities
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `).all(userId, limit) as DBActivity[];

    return activities.map(activity => ({
        id: activity.id,
        user: activity.user_name,
        action: activity.action,
        room: activity.room_name || 'General',
        timestamp: new Date(activity.created_at),
    }));
}

export function getActivitiesByRoom(roomId: string, limit: number = 50): ActivityItem[] {
    const activities = db.prepare(`
    SELECT id, user_id, user_name, action, room_id, room_name, created_at
    FROM activities
    WHERE room_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `).all(roomId, limit) as DBActivity[];

    return activities.map(activity => ({
        id: activity.id,
        user: activity.user_name,
        action: activity.action,
        room: activity.room_name || 'General',
        timestamp: new Date(activity.created_at),
    }));
}

// Cleanup old activities (older than 7 days)
export function cleanupOldActivities(): number {
    const result = db.prepare(`
    DELETE FROM activities
    WHERE created_at < datetime('now', '-7 days')
  `).run();
    return result.changes;
}
