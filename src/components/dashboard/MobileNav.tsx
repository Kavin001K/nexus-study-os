import {
    LayoutDashboard,
    BookOpen,
    Target,
    Clock,
    Settings,
} from 'lucide-react';

interface MobileNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
    const navItems = [
        { id: 'overview', label: 'Home', icon: LayoutDashboard },
        { id: 'study', label: 'Study', icon: BookOpen },
        { id: 'goals', label: 'Goals', icon: Target },
        { id: 'schedule', label: 'Plan', icon: Clock },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-auto py-2 glass-heavy border-t border-border/30 z-50 px-6 flex justify-between items-center backdrop-blur-xl bg-background/80 pb-[env(safe-area-inset-bottom)]">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center gap-1 p-1 transition-all duration-200
                        ${activeTab === item.id
                            ? 'text-primary scale-110'
                            : 'text-muted-foreground hover:text-foreground active:scale-95'}
                    `}
                >
                    <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'fill-current' : ''}`} />
                    <span className="text-[10px] font-medium">{item.label}</span>
                </button>
            ))}
        </div>
    );
}
