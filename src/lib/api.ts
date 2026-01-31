// API Client for Nexus Study OS
// Connects to the local Express backend

const API_BASE = '/api';

interface ApiResponse<T> {
    data?: T;
    error?: string;
}

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.error || 'Request failed' };
        }

        return { data };
    } catch (error) {
        console.error('API request failed:', error);
        return { error: 'Network error' };
    }
}

// Types
export interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    createdAt: string;
}

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

export interface GoalRoom {
    id: string;
    name: string;
    exam: 'jee' | 'neet' | 'upsc';
    memberCount: number;
    contentCount: number;
    activityLevel: 'high' | 'medium' | 'low';
    description: string;
}

export interface ActivityItem {
    id: string;
    user: string;
    action: string;
    room: string;
    timestamp: string;
}

// Auth API
export const authApi = {
    async googleSignIn(email: string, name: string, avatarUrl?: string) {
        return request<{ user: User; expiresAt: string }>('/auth/google', {
            method: 'POST',
            body: JSON.stringify({ email, name, avatarUrl }),
        });
    },

    async getCurrentUser() {
        return request<{ user: User }>('/auth/me');
    },

    async logout() {
        return request<{ success: boolean }>('/auth/logout', { method: 'POST' });
    },

    async updateProfile(updates: { name?: string; avatarUrl?: string }) {
        return request<{ user: User }>('/auth/profile', {
            method: 'PATCH',
            body: JSON.stringify(updates),
        });
    },
};

// Nodes API
export const nodesApi = {
    async getAll() {
        return request<{ nodes: KnowledgeNode[] }>('/nodes');
    },

    async getByExam(exam: string) {
        return request<{ nodes: KnowledgeNode[] }>(`/nodes/exam/${exam}`);
    },

    async getById(id: string) {
        return request<{ node: KnowledgeNode }>(`/nodes/${id}`);
    },

    async updateStatus(id: string, status: 'green' | 'yellow' | 'red') {
        return request<{ success: boolean }>(`/nodes/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    },
};

// Rooms API
export const roomsApi = {
    async getAll() {
        return request<{ rooms: GoalRoom[] }>('/rooms');
    },

    async getByExam(exam: string) {
        return request<{ rooms: GoalRoom[] }>(`/rooms/exam/${exam}`);
    },

    async getById(id: string) {
        return request<{ room: GoalRoom }>(`/rooms/${id}`);
    },

    async join(id: string) {
        return request<{ room: GoalRoom }>(`/rooms/${id}/join`, { method: 'POST' });
    },

    async leave(id: string) {
        return request<{ success: boolean }>(`/rooms/${id}/leave`, { method: 'POST' });
    },
};

// Activities API
export const activitiesApi = {
    async getRecent(limit: number = 20) {
        return request<{ activities: ActivityItem[] }>(`/activities?limit=${limit}`);
    },

    async getByRoom(roomId: string, limit: number = 50) {
        return request<{ activities: ActivityItem[] }>(`/activities/room/${roomId}?limit=${limit}`);
    },

    async getMyActivities(limit: number = 50) {
        return request<{ activities: ActivityItem[] }>(`/activities/me?limit=${limit}`);
    },

    async create(action: string, roomId?: string, roomName?: string) {
        return request<{ activity: ActivityItem }>('/activities', {
            method: 'POST',
            body: JSON.stringify({ action, roomId, roomName }),
        });
    },
};

// Health check
export const healthApi = {
    async check() {
        return request<{ status: string; timestamp: string; database: string; mode: string }>('/health');
    },
};

export default {
    auth: authApi,
    nodes: nodesApi,
    rooms: roomsApi,
    activities: activitiesApi,
    health: healthApi,
};
