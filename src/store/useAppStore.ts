import { create } from 'zustand';

export interface KnowledgeNode {
  id: string;
  name: string;
  subject: 'physics' | 'chemistry' | 'biology' | 'math' | 'history' | 'polity' | 'economics' | 'geography';
  exam: 'jee' | 'neet' | 'upsc';
  position: [number, number, number];
  connections: string[];
  contentCount: number;
  status: 'green' | 'yellow' | 'red';
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  room: string;
  timestamp: Date;
}

export interface GoalRoom {
  id: string;
  name: string;
  exam: 'jee' | 'neet' | 'upsc';
  memberCount: number;
  contentCount: number;
  activityLevel: 'high' | 'medium' | 'low';
  description: string;
}

interface AppState {
  // UI State
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  
  // Activity Feed
  activityFeed: ActivityItem[];
  
  // Knowledge Nodes (for 3D graph)
  knowledgeNodes: KnowledgeNode[];
  hoveredNode: string | null;
  setHoveredNode: (id: string | null) => void;
  
  // Goal Rooms
  goalRooms: GoalRoom[];
  
  // User
  isAuthenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
}

// Mock data for the 3D knowledge graph
const mockNodes: KnowledgeNode[] = [
  { id: 'physics', name: 'Physics', subject: 'physics', exam: 'jee', position: [0, 0, 0], connections: ['math', 'chemistry'], contentCount: 156, status: 'green' },
  { id: 'chemistry', name: 'Chemistry', subject: 'chemistry', exam: 'jee', position: [3, 1, -1], connections: ['physics', 'biology'], contentCount: 134, status: 'green' },
  { id: 'math', name: 'Mathematics', subject: 'math', exam: 'jee', position: [-3, 0.5, 1], connections: ['physics'], contentCount: 189, status: 'green' },
  { id: 'biology', name: 'Biology', subject: 'biology', exam: 'neet', position: [2, -1, 2], connections: ['chemistry'], contentCount: 212, status: 'green' },
  { id: 'history', name: 'History', subject: 'history', exam: 'upsc', position: [-2, 1.5, -2], connections: ['polity', 'geography'], contentCount: 78, status: 'yellow' },
  { id: 'polity', name: 'Polity', subject: 'polity', exam: 'upsc', position: [1, 2, -1.5], connections: ['history', 'economics'], contentCount: 45, status: 'red' },
  { id: 'economics', name: 'Economics', subject: 'economics', exam: 'upsc', position: [-1, -1.5, -1], connections: ['polity', 'geography'], contentCount: 67, status: 'yellow' },
  { id: 'geography', name: 'Geography', subject: 'geography', exam: 'upsc', position: [0, 1, 3], connections: ['history', 'economics'], contentCount: 89, status: 'green' },
];

const mockActivity: ActivityItem[] = [
  { id: '1', user: 'Priya', action: 'uploaded "Organic Chemistry Notes"', room: 'NEET Chemistry', timestamp: new Date(Date.now() - 120000) },
  { id: '2', user: 'Arjun', action: 'completed Thermodynamics quiz', room: 'JEE Physics', timestamp: new Date(Date.now() - 300000) },
  { id: '3', user: 'Neha', action: 'shared "Modern History Summary"', room: 'UPSC History', timestamp: new Date(Date.now() - 600000) },
  { id: '4', user: 'Rahul', action: 'asked a question about Calculus', room: 'JEE Mathematics', timestamp: new Date(Date.now() - 900000) },
  { id: '5', user: 'Ananya', action: 'uploaded "Cell Biology Diagrams"', room: 'NEET Biology', timestamp: new Date(Date.now() - 1200000) },
  { id: '6', user: 'Vikram', action: 'earned "Top Contributor" badge', room: 'JEE Chemistry', timestamp: new Date(Date.now() - 1500000) },
  { id: '7', user: 'Shreya', action: 'completed 7-day study streak', room: 'UPSC Polity', timestamp: new Date(Date.now() - 1800000) },
  { id: '8', user: 'Aditya', action: 'posted bounty for "Krebs Cycle Mind Map"', room: 'NEET Biology', timestamp: new Date(Date.now() - 2100000) },
];

const mockRooms: GoalRoom[] = [
  { id: 'jee-physics', name: 'JEE Physics', exam: 'jee', memberCount: 2847, contentCount: 1256, activityLevel: 'high', description: 'Mechanics, Thermodynamics, Electromagnetism' },
  { id: 'jee-chemistry', name: 'JEE Chemistry', exam: 'jee', memberCount: 2341, contentCount: 987, activityLevel: 'high', description: 'Organic, Inorganic, Physical Chemistry' },
  { id: 'jee-math', name: 'JEE Mathematics', exam: 'jee', memberCount: 3102, contentCount: 1432, activityLevel: 'high', description: 'Calculus, Algebra, Coordinate Geometry' },
  { id: 'neet-biology', name: 'NEET Biology', exam: 'neet', memberCount: 4521, contentCount: 2145, activityLevel: 'high', description: 'Botany, Zoology, Human Physiology' },
  { id: 'neet-chemistry', name: 'NEET Chemistry', exam: 'neet', memberCount: 3876, contentCount: 1567, activityLevel: 'medium', description: 'Organic Chemistry, Biochemistry' },
  { id: 'upsc-history', name: 'UPSC History', exam: 'upsc', memberCount: 1234, contentCount: 678, activityLevel: 'medium', description: 'Ancient, Medieval, Modern India' },
  { id: 'upsc-polity', name: 'UPSC Polity', exam: 'upsc', memberCount: 987, contentCount: 456, activityLevel: 'low', description: 'Constitution, Governance, International Relations' },
  { id: 'upsc-geography', name: 'UPSC Geography', exam: 'upsc', memberCount: 1456, contentCount: 789, activityLevel: 'medium', description: 'Physical, Human, Indian Geography' },
];

export const useAppStore = create<AppState>((set) => ({
  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  
  activityFeed: mockActivity,
  
  knowledgeNodes: mockNodes,
  hoveredNode: null,
  setHoveredNode: (id) => set({ hoveredNode: id }),
  
  goalRooms: mockRooms,
  
  isAuthenticated: false,
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
}));
