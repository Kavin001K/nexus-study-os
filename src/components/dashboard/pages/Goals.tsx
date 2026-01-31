import { useAppStore } from '@/store/useAppStore';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Target, Trophy, Flame, Star } from 'lucide-react';

export function Goals() {
    const { knowledgeNodes } = useAppStore();

    const mockProgress = [
        { subject: 'Physics', progress: 75, color: '#3b82f6' },
        { subject: 'Chemistry', progress: 60, color: '#22c55e' },
        { subject: 'Math', progress: 85, color: '#f59e0b' },
        { subject: 'Biology', progress: 45, color: '#a855f7' },
    ];

    const trophies = [
        { title: 'Early Bird', desc: 'Study before 6 AM', icon: Trophy, color: 'text-yellow-400' },
        { title: 'Week Streak', desc: '7 days continuous', icon: Flame, color: 'text-orange-400' },
        { title: 'Quiz Master', desc: 'Score 100% in 5 quizzes', icon: Star, color: 'text-purple-400' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Progress Chart */}
                <div className="lg:col-span-2 glass-panel p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Subject Mastery
                    </h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockProgress}>
                                <XAxis dataKey="subject" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="progress" radius={[4, 4, 0, 0]}>
                                    {mockProgress.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Achievements */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold px-1">Recent Achievements</h3>
                    {trophies.map((trophy, i) => (
                        <div key={i} className="glass-card p-4 flex items-center gap-4 hover:border-primary/40 transition-colors">
                            <div className={`p-3 rounded-full bg-secondary ${trophy.color} bg-opacity-10`}>
                                <trophy.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold">{trophy.title}</h4>
                                <p className="text-xs text-muted-foreground">{trophy.desc}</p>
                            </div>
                        </div>
                    ))}

                    <div className="glass-card p-4 mt-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                        <h4 className="font-bold mb-2 text-primary">Daily Goal</h4>
                        <div className="w-full bg-secondary h-2 rounded-full mb-2">
                            <div className="bg-primary h-2 rounded-full w-[70%]" />
                        </div>
                        <p className="text-xs text-muted-foreground flex justify-between">
                            <span>3.5 / 5 Hours studied</span>
                            <span>70%</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
