import { useAppStore } from '@/store/useAppStore';
import { Bell, Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function DashboardHeader() {
    const { user } = useAppStore();

    return (
        <header className="sticky top-0 z-30 w-full glass border-b border-border/30 px-6 py-4 flex items-center justify-between md:justify-end gap-4">
            <div className="md:hidden flex items-center gap-2">
                <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                </Button>
                <span className="font-bold">Nexus</span>
            </div>

            <div className="flex items-center gap-4 flex-1 md:flex-none justify-end">
                <div className="relative hidden md:block w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search topics, rooms..."
                        className="pl-9 bg-secondary/50 border-transparent focus-visible:bg-secondary"
                    />
                </div>

                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </Button>
            </div>
        </header>
    );
}
