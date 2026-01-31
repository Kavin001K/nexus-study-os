import { useAppStore } from '@/store/useAppStore';
import { useActivities, useNodes, useRooms } from '@/hooks/queries';
import { Activity, Users, BookOpen, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';

const data = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.8 },
    { day: 'Wed', hours: 4.2 },
    { day: 'Thu', hours: 5.5 },
    { day: 'Fri', hours: 3.1 },
    { day: 'Sat', hours: 6.8 },
    { day: 'Sun', hours: 4.5 },
];

export function Overview() {
    const { data: activities = [] } = useActivities();
    const { data: nodes = [] } = useNodes();
    const { data: rooms = [] } = useRooms();

    // Calculate stats
    const totalStudyHours = 32.4; // Mock
    const activeStreak = 5; // Mock
    const totalResources = nodes.reduce((acc, node) => acc + node.contentCount, 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Stat Cards */}
                <StatCard
                    title="Study Hours"
                    value={`${totalStudyHours}h`}
                    trend="+12% from last week"
                    icon={Activity}
                    color="text-blue-400"
                    bg="bg-blue-500/10"
                />
                <StatCard
                    title="Active Streak"
                    value={`${activeStreak} Days`}
                    trend="Keep it up!"
                    icon={TrendingUp}
                    color="text-green-400"
                    bg="bg-green-500/10"
                />
                <StatCard
                    title="Resources Mastered"
                    value={totalResources.toString()}
                    trend="+5 new today"
                    icon={BookOpen}
                    color="text-purple-400"
                    bg="bg-purple-500/10"
                />
                <StatCard
                    title="Collaborators"
                    value="12"
                    trend="In your network"
                    icon={Users}
                    color="text-orange-400"
                    bg="bg-orange-500/10"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="col-span-1 lg:col-span-2 glass-panel p-6 border border-border/30">
                    <h3 className="text-lg font-semibold mb-6">Study Activity</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}h`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="hours" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="glass-panel p-6 border border-border/30 flex flex-col">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[300px] scrollbar-thin">
                        {activities.slice(0, 6).map((item) => (
                            <div key={item.id} className="flex gap-3 items-start pb-3 border-b border-border/20 last:border-0">
                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 text-xs font-bold">
                                    {item.user.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm">
                                        <span className="font-semibold text-primary">{item.user}</span> {item.action}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {item.room}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4 text-xs">View All Activity</Button>
                </div>
            </div>

            {/* Goal Rooms Preview */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Suggested Study Rooms</h3>
                    <Button variant="link" className="text-primary gap-1">
                        Browse All <ArrowUpRight className="w-4 h-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rooms.slice(0, 3).map((room) => (
                        <div key={room.id} className="glass-card p-5 hover:border-primary/50 transition-colors group cursor-pointer">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground`}>
                                    {room.exam.toUpperCase()}
                                </span>
                                <span className={`flex items-center gap-1 text-xs ${room.activityLevel === 'high' ? 'text-green-400' : 'text-yellow-400'
                                    }`}>
                                    <Activity className="w-3 h-3" />
                                    {room.activityLevel.toUpperCase()}
                                </span>
                            </div>
                            <h4 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">{room.name}</h4>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{room.description}</p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {room.memberCount} members</span>
                                <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {room.contentCount} docs</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, trend, icon: Icon, color, bg }: any) {
    return (
        <div className="glass-card p-5 border border-border/30">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
                    <h4 className="text-2xl font-bold">{value}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{trend}</p>
                </div>
                <div className={`p-2 rounded-lg ${bg} ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}
