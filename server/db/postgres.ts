import pg from 'pg';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const getClient = () => pool.connect();

// Initialize database
export async function initializeDatabase() {
    if (!process.env.DATABASE_URL) {
        console.warn('⚠️ No DATABASE_URL provided. Skipping Postgres initialization.');
        return;
    }

    try {
        const schema = readFileSync(join(__dirname, 'schema.postgres.sql'), 'utf-8');
        await query(schema);
        console.log('✅ Postgres database initialized successfully');

        await seedInitialData();
    } catch (err) {
        console.error('❌ Failed to initialize Postgres:', err);
    }
}

export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

async function seedInitialData() {
    const { rows } = await query('SELECT COUNT(*) as count FROM knowledge_nodes');
    const count = parseInt(rows[0].count);

    if (count === 0) {
        console.log('📦 Seeding initial data (Postgres)...');

        // Seed Nodes
        // ... (Use same data but adapting to INSERT grammar if needed)
        // Actually, I'll copy the logic later.
    }
}
