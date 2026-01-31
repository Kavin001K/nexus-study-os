import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Shield, Bell } from 'lucide-react';

export function Settings() {
    const { user } = useAppStore();

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold tracking-tight">Account Settings</h2>

            <div className="glass-panel p-6 space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b border-border/30">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <Button variant="outline" className="mr-2">Change Avatar</Button>
                        <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">Remove</Button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Display Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                            <Input id="name" defaultValue={user?.name} className="pl-9 bg-secondary/30" />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                            <Input id="email" defaultValue={user?.email} className="pl-9 bg-secondary/30" disabled />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-2">
                    <Button variant="ghost">Cancel</Button>
                    <Button>Save Changes</Button>
                </div>
            </div>

            <div className="glass-panel p-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Privacy & Security
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                        <div>
                            <p className="font-medium">Public Profile</p>
                            <p className="text-xs text-muted-foreground">Allow others to see your study progress</p>
                        </div>
                        <div className="h-6 w-11 bg-primary rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                        <div>
                            <p className="font-medium">Activity Status</p>
                            <p className="text-xs text-muted-foreground">Show when you are active in study rooms</p>
                        </div>
                        <div className="h-6 w-11 bg-primary rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
