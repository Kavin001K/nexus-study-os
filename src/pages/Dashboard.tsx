import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { DashboardSidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { Overview } from '@/components/dashboard/Overview';
import { StudyRooms } from '@/components/dashboard/pages/StudyRooms';
import { Goals } from '@/components/dashboard/pages/Goals';
import { Schedule } from '@/components/dashboard/pages/Schedule';
import { Settings } from '@/components/dashboard/pages/Settings';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { isAuthenticated, user, initializeData } = useAppStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        // Redirect if not authenticated
        if (!isAuthenticated && !user) {
            navigate('/');
        }

        // Refresh data when entering dashboard
        initializeData();
    }, [isAuthenticated, user, navigate, initializeData]);

    if (!isAuthenticated && !user) return null;

    return (
        <div className="min-h-screen bg-background flex">
            <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 md:ml-64 relative min-h-screen">
                {/* Dynamic Background */}
                <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-background pointer-events-none -z-10" />
                <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none -z-10 opacity-20" />

                <DashboardHeader />

                <div className="p-6 max-w-7xl mx-auto pb-20">
                    {activeTab === 'overview' && <Overview />}
                    {activeTab === 'study' && <StudyRooms />}
                    {activeTab === 'goals' && <Goals />}
                    {activeTab === 'schedule' && <Schedule />}
                    {activeTab === 'settings' && <Settings />}
                </div>
            </main>
        </div>
    );
}
