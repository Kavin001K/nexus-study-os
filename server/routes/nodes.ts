import { Router } from 'express';
import * as nodes from '../services/nodes.js';
import type { Request, Response } from 'express';

const router = Router();

// Get all knowledge nodes
router.get('/', (_req: Request, res: Response) => {
    try {
        const allNodes = nodes.getAllNodes();
        return res.json({ nodes: allNodes });
    } catch (error) {
        console.error('Error fetching nodes:', error);
        return res.status(500).json({ error: 'Failed to fetch nodes' });
    }
});

// Get nodes by exam
router.get('/exam/:exam', (req: Request, res: Response) => {
    const { exam } = req.params;

    if (!['jee', 'neet', 'upsc'].includes(exam)) {
        return res.status(400).json({ error: 'Invalid exam type' });
    }

    try {
        const examNodes = nodes.getNodesByExam(exam);
        return res.json({ nodes: examNodes });
    } catch (error) {
        console.error('Error fetching nodes:', error);
        return res.status(500).json({ error: 'Failed to fetch nodes' });
    }
});

// Get single node
router.get('/:id', (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const node = nodes.getNodeById(id);
        if (!node) {
            return res.status(404).json({ error: 'Node not found' });
        }
        return res.json({ node });
    } catch (error) {
        console.error('Error fetching node:', error);
        return res.status(500).json({ error: 'Failed to fetch node' });
    }
});

// Update node status
router.patch('/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['green', 'yellow', 'red'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const updated = nodes.updateNodeStatus(id, status);
        if (!updated) {
            return res.status(404).json({ error: 'Node not found' });
        }
        return res.json({ success: true });
    } catch (error) {
        console.error('Error updating node:', error);
        return res.status(500).json({ error: 'Failed to update node' });
    }
});

export default router;
