import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize database
const DB_PATH = join(__dirname, 'nexus.db');
const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema
export function initializeDatabase(): void {
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
  db.exec(schema);
  console.log('✅ Database initialized successfully');
  
  // Seed initial data if empty
  seedInitialData();
}

// Generate unique IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Seed initial data
function seedInitialData(): void {
  const nodeCount = db.prepare('SELECT COUNT(*) as count FROM knowledge_nodes').get() as { count: number };
  
  if (nodeCount.count === 0) {
    console.log('📦 Seeding initial data...');
    
    // Seed knowledge nodes
    const insertNode = db.prepare(`
      INSERT INTO knowledge_nodes (id, name, subject, exam, position_x, position_y, position_z, content_count, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const nodes = [
      { id: 'physics', name: 'Physics', subject: 'physics', exam: 'jee', position: [0, 0, 0], contentCount: 156, status: 'green' },
      { id: 'chemistry', name: 'Chemistry', subject: 'chemistry', exam: 'jee', position: [3, 1, -1], contentCount: 134, status: 'green' },
      { id: 'math', name: 'Mathematics', subject: 'math', exam: 'jee', position: [-3, 0.5, 1], contentCount: 189, status: 'green' },
      { id: 'biology', name: 'Biology', subject: 'biology', exam: 'neet', position: [2, -1, 2], contentCount: 212, status: 'green' },
      { id: 'history', name: 'History', subject: 'history', exam: 'upsc', position: [-2, 1.5, -2], contentCount: 78, status: 'yellow' },
      { id: 'polity', name: 'Polity', subject: 'polity', exam: 'upsc', position: [1, 2, -1.5], contentCount: 45, status: 'red' },
      { id: 'economics', name: 'Economics', subject: 'economics', exam: 'upsc', position: [-1, -1.5, -1], contentCount: 67, status: 'yellow' },
      { id: 'geography', name: 'Geography', subject: 'geography', exam: 'upsc', position: [0, 1, 3], contentCount: 89, status: 'green' },
    ];
    
    for (const node of nodes) {
      insertNode.run(
        node.id, node.name, node.subject, node.exam,
        node.position[0], node.position[1], node.position[2],
        node.contentCount, node.status
      );
    }
    
    // Seed node connections
    const insertConnection = db.prepare(`
      INSERT INTO node_connections (from_node_id, to_node_id) VALUES (?, ?)
    `);
    
    const connections = [
      ['physics', 'math'], ['physics', 'chemistry'],
      ['chemistry', 'biology'],
      ['history', 'polity'], ['history', 'geography'],
      ['polity', 'economics'],
      ['economics', 'geography'],
    ];
    
    for (const [from, to] of connections) {
      insertConnection.run(from, to);
      insertConnection.run(to, from); // Bidirectional
    }
    
    // Seed goal rooms
    const insertRoom = db.prepare(`
      INSERT INTO goal_rooms (id, name, exam, member_count, content_count, activity_level, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const rooms = [
      { id: 'jee-physics', name: 'JEE Physics', exam: 'jee', memberCount: 2847, contentCount: 1256, activityLevel: 'high', description: 'Mechanics, Thermodynamics, Electromagnetism' },
      { id: 'jee-chemistry', name: 'JEE Chemistry', exam: 'jee', memberCount: 2341, contentCount: 987, activityLevel: 'high', description: 'Organic, Inorganic, Physical Chemistry' },
      { id: 'jee-math', name: 'JEE Mathematics', exam: 'jee', memberCount: 3102, contentCount: 1432, activityLevel: 'high', description: 'Calculus, Algebra, Coordinate Geometry' },
      { id: 'neet-biology', name: 'NEET Biology', exam: 'neet', memberCount: 4521, contentCount: 2145, activityLevel: 'high', description: 'Botany, Zoology, Human Physiology' },
      { id: 'neet-chemistry', name: 'NEET Chemistry', exam: 'neet', memberCount: 3876, contentCount: 1567, activityLevel: 'medium', description: 'Organic Chemistry, Biochemistry' },
      { id: 'upsc-history', name: 'UPSC History', exam: 'upsc', memberCount: 1234, contentCount: 678, activityLevel: 'medium', description: 'Ancient, Medieval, Modern India' },
      { id: 'upsc-polity', name: 'UPSC Polity', exam: 'upsc', memberCount: 987, contentCount: 456, activityLevel: 'low', description: 'Constitution, Governance, International Relations' },
      { id: 'upsc-geography', name: 'UPSC Geography', exam: 'upsc', memberCount: 1456, contentCount: 789, activityLevel: 'medium', description: 'Physical, Human, Indian Geography' },
    ];
    
    for (const room of rooms) {
      insertRoom.run(room.id, room.name, room.exam, room.memberCount, room.contentCount, room.activityLevel, room.description);
    }
    
    // Seed demo users
    const insertUser = db.prepare(`
      INSERT INTO users (id, email, name, avatar_url) VALUES (?, ?, ?, ?)
    `);
    
    const users = [
      { id: 'demo-user-1', email: 'priya@demo.com', name: 'Priya', avatar: null },
      { id: 'demo-user-2', email: 'arjun@demo.com', name: 'Arjun', avatar: null },
      { id: 'demo-user-3', email: 'neha@demo.com', name: 'Neha', avatar: null },
      { id: 'demo-user-4', email: 'rahul@demo.com', name: 'Rahul', avatar: null },
      { id: 'demo-user-5', email: 'ananya@demo.com', name: 'Ananya', avatar: null },
      { id: 'demo-user-6', email: 'vikram@demo.com', name: 'Vikram', avatar: null },
      { id: 'demo-user-7', email: 'shreya@demo.com', name: 'Shreya', avatar: null },
      { id: 'demo-user-8', email: 'aditya@demo.com', name: 'Aditya', avatar: null },
    ];
    
    for (const user of users) {
      insertUser.run(user.id, user.email, user.name, user.avatar);
    }
    
    // Seed activities
    const insertActivity = db.prepare(`
      INSERT INTO activities (id, user_id, user_name, action, room_id, room_name, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const activities = [
      { userId: 'demo-user-1', userName: 'Priya', action: 'uploaded "Organic Chemistry Notes"', roomId: 'neet-chemistry', roomName: 'NEET Chemistry', offset: 2 },
      { userId: 'demo-user-2', userName: 'Arjun', action: 'completed Thermodynamics quiz', roomId: 'jee-physics', roomName: 'JEE Physics', offset: 5 },
      { userId: 'demo-user-3', userName: 'Neha', action: 'shared "Modern History Summary"', roomId: 'upsc-history', roomName: 'UPSC History', offset: 10 },
      { userId: 'demo-user-4', userName: 'Rahul', action: 'asked a question about Calculus', roomId: 'jee-math', roomName: 'JEE Mathematics', offset: 15 },
      { userId: 'demo-user-5', userName: 'Ananya', action: 'uploaded "Cell Biology Diagrams"', roomId: 'neet-biology', roomName: 'NEET Biology', offset: 20 },
      { userId: 'demo-user-6', userName: 'Vikram', action: 'earned "Top Contributor" badge', roomId: 'jee-chemistry', roomName: 'JEE Chemistry', offset: 25 },
      { userId: 'demo-user-7', userName: 'Shreya', action: 'completed 7-day study streak', roomId: 'upsc-polity', roomName: 'UPSC Polity', offset: 30 },
      { userId: 'demo-user-8', userName: 'Aditya', action: 'posted bounty for "Krebs Cycle Mind Map"', roomId: 'neet-biology', roomName: 'NEET Biology', offset: 35 },
    ];
    
    for (const activity of activities) {
      const timestamp = new Date(Date.now() - activity.offset * 60 * 1000).toISOString();
      insertActivity.run(
        generateId(), activity.userId, activity.userName, activity.action,
        activity.roomId, activity.roomName, timestamp
      );
    }
    
    console.log('✅ Initial data seeded successfully');
  }
}

export default db;
