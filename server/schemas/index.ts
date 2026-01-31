import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        name: z.string().min(1, "Name is required"),
        avatarUrl: z.string().optional(),
    }),
});

export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        avatarUrl: z.string().url().optional(),
    }),
});

// Node Schemas
export const updateNodeStatusSchema = z.object({
    body: z.object({
        status: z.enum(['green', 'yellow', 'red']),
    }),
    params: z.object({
        id: z.string(),
    }),
});

export const nodeParamSchema = z.object({
    params: z.object({
        id: z.string(),
    }),
});

export const examParamSchema = z.object({
    params: z.object({
        exam: z.enum(['jee', 'neet', 'upsc']),
    }),
});

// Activity Schemas
export const createActivitySchema = z.object({
    body: z.object({
        action: z.string().min(1, "Action is required"),
        roomId: z.string().optional(),
        roomName: z.string().optional(),
    }),
});

// Room Schemas
export const roomParamSchema = z.object({
    params: z.object({
        id: z.string(),
    }),
});
