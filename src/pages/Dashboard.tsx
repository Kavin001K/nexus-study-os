import { useEffect, useState, Suspense, lazy } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { DashboardSidebar } from '@/components/dashboard/Sidebar';
import { MobileNav } from '@/components/dashboard/MobileNav';
import { DashboardHeader } from '@/components/dashboard/Header';
import { ComponentLoader } from '@/components/ui/loading';
import { useNavigate } from 'react-router-dom';

// Lazy load sub-pages
const Overview = lazy(() => import('@/components/dashboard/Overview').then(m => ({ default: m.Overview })));
const StudyRooms = lazy(() => import('@/components/dashboard/pages/StudyRooms').then(m => ({ default: m.StudyRooms })));
const Goals = lazy(() => import('@/components/dashboard/pages/Goals').then(m => ({ default: m.Goals })));
const Schedule = lazy(() => import('@/components/dashboard/pages/Schedule').then(m => ({ default: m.Schedule })));
const Settings = lazy(() => import('@/components/dashboard/pages/Settings').then(m => ({ default: m.Settings })));

export default function Dashboard() {
    const isAuthenticated = useAppStore((state) => state.isAuthenticated);
    const user = useAppStore((state) => state.user);
    const initializeData = useAppStore((state) => state.initializeData);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        // Redirect if not authenticated
        const timeout = setTimeout(() => {
            if (!isAuthenticated && !user) {
                navigate('/');
            }
        }, 500); // Small delay to allow auth check to complete
        return () => clearTimeout(timeout);
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        // Refresh data when entering dashboard (only on mount)
        initializeData();
    }, []);

    if (!isAuthenticated && !user) return null;

    return (
        <div className="min-h-screen bg-background flex">
            <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 md:ml-64 relative min-h-screen">
                {/* Dynamic Background */}
                <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-background pointer-events-none -z-10" />
                <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none -z-10 opacity-20" />

                <DashboardHeader />

                <div className="p-6 max-w-7xl mx-auto pb-24">
                    <Suspense fallback={<ComponentLoader />}>
                        {activeTab === 'overview' && <Overview />}
                        {activeTab === 'study' && <StudyRooms />}
                        {activeTab === 'goals' && <Goals />}
                        {activeTab === 'schedule' && <Schedule />}
                        {activeTab === 'settings' && <Settings />}
                    </Suspense>
                </div>
            </main>
            <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
}
