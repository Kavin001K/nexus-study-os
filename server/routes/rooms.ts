import { Router } from 'express';
import * as rooms from '../services/rooms.js';
import type { Request, Response } from 'express';
import { validate } from '../middleware/security.js';
import { examParamSchema, roomParamSchema } from '../schemas/index.js';

const router = Router();

// Get all rooms
router.get('/', async (_req: Request, res: Response) => {
    try {
        const allRooms = await rooms.getAllRooms();
        return res.json({ rooms: allRooms });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return res.status(500).json({ error: 'Failed to fetch rooms' });
    }
});

// Get rooms by exam
router.get('/exam/:exam', validate(examParamSchema), async (req: Request, res: Response) => {
    const exam = req.params.exam as string;

    // Zod handles validation

    try {
        const examRooms = await rooms.getRoomsByExam(exam);
        return res.json({ rooms: examRooms });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return res.status(500).json({ error: 'Failed to fetch rooms' });
    }
});

// Get single room
router.get('/:id', validate(roomParamSchema), async (req: Request, res: Response) => {
    const id = req.params.id as string;

    try {
        const room = await rooms.getRoomById(id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        return res.json({ room });
    } catch (error) {
        console.error('Error fetching room:', error);
        return res.status(500).json({ error: 'Failed to fetch room' });
    }
});

// Join a room (increment member count)
router.post('/:id/join', validate(roomParamSchema), async (req: Request, res: Response) => {
    const id = req.params.id as string;

    try {
        const success = await rooms.incrementRoomMembers(id);
        if (!success) {
            return res.status(404).json({ error: 'Room not found' });
        }
        const room = await rooms.getRoomById(id);
        return res.json({ room });
    } catch (error) {
        console.error('Error joining room:', error);
        return res.status(500).json({ error: 'Failed to join room' });
    }
});

// Leave a room (decrement member count)
router.post('/:id/leave', validate(roomParamSchema), async (req: Request, res: Response) => {
    const id = req.params.id as string;

    try {
        const success = await rooms.decrementRoomMembers(id);
        if (!success) {
            return res.status(404).json({ error: 'Room not found' });
        }
        return res.json({ success: true });
    } catch (error) {
        console.error('Error leaving room:', error);
        return res.status(500).json({ error: 'Failed to leave room' });
    }
});

export default router;
