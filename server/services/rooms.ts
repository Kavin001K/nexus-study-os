import db from '../db/index.js';
import { generateId } from '../db/database.js';

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

export async function getAllRooms(): Promise<GoalRoom[]> {
  const result = await db.query(`
    SELECT id, name, exam, member_count, content_count, activity_level, description
    FROM goal_rooms
    ORDER BY member_count DESC
  `);
  const rooms = result.rows as DBRoom[];

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

export async function getRoomById(id: string): Promise<GoalRoom | null> {
  const room = await db.get(`
    SELECT id, name, exam, member_count, content_count, activity_level, description
    FROM goal_rooms WHERE id = ?
  `, [id]) as DBRoom | undefined;

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

export async function getRoomsByExam(exam: string): Promise<GoalRoom[]> {
  const result = await db.query(`
    SELECT id, name, exam, member_count, content_count, activity_level, description
    FROM goal_rooms
    WHERE exam = ?
    ORDER BY member_count DESC
  `, [exam]);
  const rooms = result.rows as DBRoom[];

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

export async function incrementRoomMembers(id: string): Promise<boolean> {
  const result = await db.query(`
    UPDATE goal_rooms SET member_count = member_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `, [id]);
  return result.rowCount > 0;
}

export async function decrementRoomMembers(id: string): Promise<boolean> {
  const result = await db.query(`
    UPDATE goal_rooms SET member_count = CASE WHEN member_count > 0 THEN member_count - 1 ELSE 0 END, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `, [id]);
  return result.rowCount > 0;
}

export async function incrementRoomContent(id: string): Promise<boolean> {
  const result = await db.query(`
    UPDATE goal_rooms SET content_count = content_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `, [id]);
  return result.rowCount > 0;
}

export async function updateRoomActivityLevel(id: string, level: 'high' | 'medium' | 'low'): Promise<boolean> {
  const result = await db.query(`
    UPDATE goal_rooms SET activity_level = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `, [level, id]);
  return result.rowCount > 0;
}
