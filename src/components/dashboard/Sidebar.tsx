import { useAppStore } from '@/store/useAppStore';
import {
    LayoutDashboard,
    BookOpen,
    Target,
    Clock,
    Settings,
    LogOut,
    Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function DashboardSidebar({ activeTab, setActiveTab }: SidebarProps) {
    const navigate = useNavigate();
    const { logout, user } = useAppStore();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'study', label: 'Study Rooms', icon: BookOpen },
        { id: 'goals', label: 'Goals & Progress', icon: Target },
        { id: 'schedule', label: 'Schedule', icon: Clock },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 glass-heavy border-r border-border/30 z-40">
            {/* Logo */}
            <div
                className="p-6 flex items-center gap-3 cursor-pointer"
                onClick={() => navigate('/')}
            >
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    <Zap className="w-5 h-5 fill-current" />
                </div>
                <span className="text-xl font-bold tracking-tight">Nexus</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${activeTab === item.id
                                ? 'bg-primary/10 text-primary font-medium shadow-sm border border-primary/20'
                                : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground border border-transparent'}
            `}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-border/30">
                <div className="glass-card p-3 flex items-center gap-3 mb-3 bg-secondary/30">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email || 'student@nexus.com'}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/20 gap-2 border border-transparent hover:border-red-900/30"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </Button>
            </div>
        </aside>
    );
}
