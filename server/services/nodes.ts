import db, { generateId } from '../db/database.js';

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

interface DBNode {
    id: string;
    name: string;
    subject: string;
    exam: string;
    position_x: number;
    position_y: number;
    position_z: number;
    content_count: number;
    status: string;
}

export function getAllNodes(): KnowledgeNode[] {
    const nodes = db.prepare(`
    SELECT id, name, subject, exam, position_x, position_y, position_z, content_count, status
    FROM knowledge_nodes
  `).all() as DBNode[];

    const connections = db.prepare(`
    SELECT from_node_id, to_node_id FROM node_connections
  `).all() as { from_node_id: string; to_node_id: string }[];

    const connectionMap = new Map<string, string[]>();
    for (const conn of connections) {
        if (!connectionMap.has(conn.from_node_id)) {
            connectionMap.set(conn.from_node_id, []);
        }
        connectionMap.get(conn.from_node_id)!.push(conn.to_node_id);
    }

    return nodes.map(node => ({
        id: node.id,
        name: node.name,
        subject: node.subject as KnowledgeNode['subject'],
        exam: node.exam as KnowledgeNode['exam'],
        position: [node.position_x, node.position_y, node.position_z] as [number, number, number],
        connections: connectionMap.get(node.id) || [],
        contentCount: node.content_count,
        status: node.status as KnowledgeNode['status'],
    }));
}

export function getNodeById(id: string): KnowledgeNode | null {
    const node = db.prepare(`
    SELECT id, name, subject, exam, position_x, position_y, position_z, content_count, status
    FROM knowledge_nodes WHERE id = ?
  `).get(id) as DBNode | undefined;

    if (!node) return null;

    const connections = db.prepare(`
    SELECT to_node_id FROM node_connections WHERE from_node_id = ?
  `).all(id) as { to_node_id: string }[];

    return {
        id: node.id,
        name: node.name,
        subject: node.subject as KnowledgeNode['subject'],
        exam: node.exam as KnowledgeNode['exam'],
        position: [node.position_x, node.position_y, node.position_z] as [number, number, number],
        connections: connections.map(c => c.to_node_id),
        contentCount: node.content_count,
        status: node.status as KnowledgeNode['status'],
    };
}

export function getNodesByExam(exam: string): KnowledgeNode[] {
    return getAllNodes().filter(n => n.exam === exam);
}

export function updateNodeStatus(id: string, status: 'green' | 'yellow' | 'red'): boolean {
    const result = db.prepare(`
    UPDATE knowledge_nodes SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).run(status, id);
    return result.changes > 0;
}

export function incrementNodeContent(id: string): boolean {
    const result = db.prepare(`
    UPDATE knowledge_nodes SET content_count = content_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).run(id);
    return result.changes > 0;
}
