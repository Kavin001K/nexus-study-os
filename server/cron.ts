import { cleanupExpiredSessions } from './services/auth.js';
import { cleanupOldActivities } from './services/activities.js';

export function startCleanupTasks() {
    console.log('⏰ Cleanup tasks scheduler started');

    // Run immediately on start (optional, maybe wait a bit)
    // runCleanup();

    // Schedule regular cleanup
    setInterval(runCleanup, 10 * 60 * 1000); // 10 minutes
}

async function runCleanup() {
    console.log('🧹 Running cleanup tasks...');
    try {
        const expiredSessions = await cleanupExpiredSessions();
        const oldActivities = await cleanupOldActivities();
        if (expiredSessions > 0 || oldActivities > 0) {
            console.log(`✨ Cleaned up: ${expiredSessions} sessions, ${oldActivities} activities`);
        }
    } catch (e) {
        console.error('❌ Cleanup error:', e);
    }
}
