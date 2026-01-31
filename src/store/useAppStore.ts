import { create } from 'zustand';
import { nodesApi, roomsApi, activitiesApi, authApi } from '@/lib/api';
import type { KnowledgeNode, GoalRoom, ActivityItem, User } from '@/lib/api';

// Re-export types for convenience
export type { KnowledgeNode, GoalRoom, ActivityItem, User };

interface AppState {
  // UI State
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Activity Feed
  activityFeed: ActivityItem[];
  fetchActivities: () => Promise<void>;

  // Knowledge Nodes (for 3D graph)
  knowledgeNodes: KnowledgeNode[];
  hoveredNode: string | null;
  setHoveredNode: (id: string | null) => void;
  fetchNodes: () => Promise<void>;

  // Goal Rooms
  goalRooms: GoalRoom[];
  fetchRooms: () => Promise<void>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: (roomId: string) => Promise<void>;

  // User & Auth
  user: User | null;
  isAuthenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
  login: (email: string, name: string, avatarUrl?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;

  // Initialize app data
  initializeData: () => Promise<void>;
}

// Fallback mock data (used if API fails)
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
  { id: '1', user: 'Priya', action: 'uploaded "Organic Chemistry Notes"', room: 'NEET Chemistry', timestamp: new Date(Date.now() - 120000).toISOString() },
  { id: '2', user: 'Arjun', action: 'completed Thermodynamics quiz', room: 'JEE Physics', timestamp: new Date(Date.now() - 300000).toISOString() },
  { id: '3', user: 'Neha', action: 'shared "Modern History Summary"', room: 'UPSC History', timestamp: new Date(Date.now() - 600000).toISOString() },
  { id: '4', user: 'Rahul', action: 'asked a question about Calculus', room: 'JEE Mathematics', timestamp: new Date(Date.now() - 900000).toISOString() },
];

const mockRooms: GoalRoom[] = [
  { id: 'jee-physics', name: 'JEE Physics', exam: 'jee', memberCount: 2847, contentCount: 1256, activityLevel: 'high', description: 'Mechanics, Thermodynamics, Electromagnetism' },
  { id: 'jee-chemistry', name: 'JEE Chemistry', exam: 'jee', memberCount: 2341, contentCount: 987, activityLevel: 'high', description: 'Organic, Inorganic, Physical Chemistry' },
  { id: 'neet-biology', name: 'NEET Biology', exam: 'neet', memberCount: 4521, contentCount: 2145, activityLevel: 'high', description: 'Botany, Zoology, Human Physiology' },
];

export const useAppStore = create<AppState>((set, get) => ({
  // UI State
  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),

  // Loading
  isLoading: false,
  error: null,

  // Activity Feed
  activityFeed: mockActivity,
  fetchActivities: async () => {
    const response = await activitiesApi.getRecent(20);
    if (response.data?.activities) {
      set({ activityFeed: response.data.activities });
    }
  },

  // Knowledge Nodes
  knowledgeNodes: mockNodes,
  hoveredNode: null,
  setHoveredNode: (id) => set({ hoveredNode: id }),
  fetchNodes: async () => {
    const response = await nodesApi.getAll();
    if (response.data?.nodes) {
      set({ knowledgeNodes: response.data.nodes });
    }
  },

  // Goal Rooms
  goalRooms: mockRooms,
  fetchRooms: async () => {
    const response = await roomsApi.getAll();
    if (response.data?.rooms) {
      set({ goalRooms: response.data.rooms });
    }
  },
  joinRoom: async (roomId) => {
    const response = await roomsApi.join(roomId);
    if (response.data?.room) {
      // Update the room in the list
      const rooms = get().goalRooms.map(r =>
        r.id === roomId ? response.data!.room : r
      );
      set({ goalRooms: rooms });
    }
  },
  leaveRoom: async (roomId) => {
    const response = await roomsApi.leave(roomId);
    if (response.data?.success) {
      await get().fetchRooms();
    }
  },

  // User & Auth
  user: null,
  isAuthenticated: false,
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),

  login: async (email, name, avatarUrl) => {
    set({ isLoading: true, error: null });
    const response = await authApi.googleSignIn(email, name, avatarUrl);
    if (response.data?.user) {
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false
      });
      return true;
    }
    set({ error: response.error || 'Login failed', isLoading: false });
    return false;
  },

  logout: async () => {
    await authApi.logout();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const response = await authApi.getCurrentUser();
    if (response.data?.user) {
      set({ user: response.data.user, isAuthenticated: true });
    }
  },

  // Initialize
  initializeData: async () => {
    set({ isLoading: true });
    try {
      // Fetch all data in parallel
      await Promise.all([
        get().fetchNodes(),
        get().fetchRooms(),
        get().fetchActivities(),
        get().checkAuth(),
      ]);
    } catch (error) {
      console.error('Failed to initialize data:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
