import { Router } from 'express';
import * as nodes from '../services/nodes.js';
import type { Request, Response } from 'express';
import { validate } from '../middleware/security.js';
import { examParamSchema, nodeParamSchema, updateNodeStatusSchema } from '../schemas/index.js';

const router = Router();

// Get all knowledge nodes
router.get('/', async (_req: Request, res: Response) => {
    try {
        const allNodes = await nodes.getAllNodes();
        return res.json({ nodes: allNodes });
    } catch (error) {
        console.error('Error fetching nodes:', error);
        return res.status(500).json({ error: 'Failed to fetch nodes' });
    }
});

// Get nodes by exam
router.get('/exam/:exam', validate(examParamSchema), async (req: Request, res: Response) => {
    const exam = req.params.exam as string;

    // Zod middleware handles validation

    try {
        const examNodes = await nodes.getNodesByExam(exam);
        return res.json({ nodes: examNodes });
    } catch (error) {
        console.error('Error fetching nodes:', error);
        return res.status(500).json({ error: 'Failed to fetch nodes' });
    }
});

// Get single node
router.get('/:id', validate(nodeParamSchema), async (req: Request, res: Response) => {
    const id = req.params.id as string;

    try {
        const node = await nodes.getNodeById(id);
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
router.patch('/:id/status', validate(updateNodeStatusSchema), async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status } = req.body;

    // Zod middleware handles validation

    try {
        const updated = await nodes.updateNodeStatus(id, status);
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
