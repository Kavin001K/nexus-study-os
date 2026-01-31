import { query as pgQuery, initializeDatabase as initPg } from './postgres.js';
import sqliteDb, { initializeDatabase as initSqlite } from './database.js';

const IS_POSTGRES = !!process.env.DATABASE_URL;

export async function initializeDatabase() {
    if (IS_POSTGRES) {
        await initPg();
    } else {
        initSqlite();
    }
}

export interface DBResult {
    rows: any[];
    rowCount: number;
}

export const db = {
    query: async (text: string, params: any[] = []): Promise<DBResult> => {
        if (IS_POSTGRES) {
            // Postgres implementation
            // Convert ? to $1, $2, etc. (simple regex for basic cases)
            let queryText = text;
            let paramIndex = 1;
            while (queryText.includes('?')) {
                queryText = queryText.replace('?', `$${paramIndex++}`);
            }

            // Handle specific SQLite -> Postgres syntax conversions if needed
            queryText = queryText.replace("datetime('now')", "NOW()");
            queryText = queryText.replace("CURRENT_TIMESTAMP", "NOW()");

            const result = await pgQuery(queryText, params);
            return {
                rows: result.rows,
                rowCount: result.rowCount || 0
            };
        } else {
            // SQLite implementation (Promisified)
            try {
                // Heuristic: SELECT uses .all() or .get(), INSERT/UPDATE/DELETE uses .run()
                const isSelect = text.trim().toUpperCase().startsWith('SELECT');
                const stmt = sqliteDb.prepare(text);

                if (isSelect) {
                    const rows = stmt.all(...params);
                    return {
                        rows: rows,
                        rowCount: rows.length
                    };
                } else {
                    const result = stmt.run(...params);
                    return {
                        rows: [],
                        rowCount: result.changes
                    };
                }
            } catch (error) {
                console.error('SQLite Query Error:', error);
                throw error;
            }
        }
    },

    // Helper for single row
    get: async (text: string, params: any[] = []): Promise<any> => {
        const result = await db.query(text, params);
        return result.rows[0] || null;
    }
};

export default db;
