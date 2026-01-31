import db, { generateId } from '../db/database.js';

export interface GoalRoom {
    id: string;
    name: string;
    exam: 'jee' | 'neet' | 'upsc';
    memberCount: number;
    contentCount: number;
    activityLevel: 'high' | 'medium' | 'low';
    description: string;
}

interface DBRoom {
    id: string;
    name: string;
    exam: string;
    member_count: number;
    content_count: number;
    activity_level: string;
    description: string;
}

export function getAllRooms(): GoalRoom[] {
    const rooms = db.prepare(`
    SELECT id, name, exam, member_count, content_count, activity_level, description
    FROM goal_rooms
    ORDER BY member_count DESC
  `).all() as DBRoom[];

    return rooms.map(room => ({
        id: room.id,
        name: room.name,
        exam: room.exam as GoalRoom['exam'],
        memberCount: room.member_count,
        contentCount: room.content_count,
        activityLevel: room.activity_level as GoalRoom['activityLevel'],
        description: room.description,
    }));
}

export function getRoomById(id: string): GoalRoom | null {
    const room = db.prepare(`
    SELECT id, name, exam, member_count, content_count, activity_level, description
    FROM goal_rooms WHERE id = ?
  `).get(id) as DBRoom | undefined;

    if (!room) return null;

    return {
        id: room.id,
        name: room.name,
        exam: room.exam as GoalRoom['exam'],
        memberCount: room.member_count,
        contentCount: room.content_count,
        activityLevel: room.activity_level as GoalRoom['activityLevel'],
        description: room.description,
    };
}

export function getRoomsByExam(exam: string): GoalRoom[] {
    return getAllRooms().filter(r => r.exam === exam);
}

export function incrementRoomMembers(id: string): boolean {
    const result = db.prepare(`
    UPDATE goal_rooms SET member_count = member_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).run(id);
    return result.changes > 0;
}

export function decrementRoomMembers(id: string): boolean {
    const result = db.prepare(`
    UPDATE goal_rooms SET member_count = CASE WHEN member_count > 0 THEN member_count - 1 ELSE 0 END, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).run(id);
    return result.changes > 0;
}

export function incrementRoomContent(id: string): boolean {
    const result = db.prepare(`
    UPDATE goal_rooms SET content_count = content_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).run(id);
    return result.changes > 0;
}

export function updateRoomActivityLevel(id: string, level: 'high' | 'medium' | 'low'): boolean {
    const result = db.prepare(`
    UPDATE goal_rooms SET activity_level = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).run(level, id);
    return result.changes > 0;
}
