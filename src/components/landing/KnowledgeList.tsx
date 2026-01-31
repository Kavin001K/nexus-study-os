import { useNodes } from '@/hooks/queries';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';

const subjectColors: Record<string, string> = {
    physics: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    chemistry: 'bg-green-500/10 text-green-400 border-green-500/20',
    biology: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    math: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    history: 'bg-red-500/10 text-red-400 border-red-500/20',
    polity: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    economics: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    geography: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
};

export function KnowledgeList() {
    const { data: nodes = [] } = useNodes();
    const { login } = useAppStore();
    const navigate = useNavigate();

    const handleLogin = async () => {
        await login('user@example.com', 'Demo User', undefined);
        navigate('/dashboard');
    };

    return (
        <div className="absolute inset-0 z-20 bg-background overflow-y-auto pt-24 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                            <Zap className="w-5 h-5 fill-current" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">Topic Explorer</h2>
                    </div>
                    <Button onClick={handleLogin}>
                        Connect with Google
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {nodes.map((node) => (
                        <div
                            key={node.id}
                            className="glass-card p-4 hover:border-primary/50 transition-all duration-300 group cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline" className={`${subjectColors[node.subject] || 'bg-secondary'} border uppercase text-[10px]`}>
                                    {node.subject}
                                </Badge>
                                {node.status === 'red' && (
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                )}
                            </div>
                            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{node.name}</h3>
                            <p className="text-xs text-muted-foreground">{node.contentCount} resources</p>
                        </div>
                    ))}
                    {nodes.length === 0 && (
                        <div className="col-span-full text-center text-muted-foreground py-10">
                            Loading knowledge nodes...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
