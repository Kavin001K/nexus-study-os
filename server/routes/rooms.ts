import { Router } from 'express';
import * as rooms from '../services/rooms.js';
import type { Request, Response } from 'express';

const router = Router();

// Get all rooms
router.get('/', (_req: Request, res: Response) => {
    try {
        const allRooms = rooms.getAllRooms();
        return res.json({ rooms: allRooms });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return res.status(500).json({ error: 'Failed to fetch rooms' });
    }
});

// Get rooms by exam
router.get('/exam/:exam', (req: Request, res: Response) => {
    const { exam } = req.params;

    if (!['jee', 'neet', 'upsc'].includes(exam)) {
        return res.status(400).json({ error: 'Invalid exam type' });
    }

    try {
        const examRooms = rooms.getRoomsByExam(exam);
        return res.json({ rooms: examRooms });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return res.status(500).json({ error: 'Failed to fetch rooms' });
    }
});

// Get single room
router.get('/:id', (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const room = rooms.getRoomById(id);
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
router.post('/:id/join', (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const success = rooms.incrementRoomMembers(id);
        if (!success) {
            return res.status(404).json({ error: 'Room not found' });
        }
        const room = rooms.getRoomById(id);
        return res.json({ room });
    } catch (error) {
        console.error('Error joining room:', error);
        return res.status(500).json({ error: 'Failed to join room' });
    }
});

// Leave a room (decrement member count)
router.post('/:id/leave', (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const success = rooms.decrementRoomMembers(id);
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
