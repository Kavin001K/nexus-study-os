import { Calendar, Clock, Video, Book, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Schedule() {
    const events = [
        { time: '09:00 AM', title: 'Live: Organic Chemistry', type: 'lecture', duration: '1.5h', icon: Video, color: 'text-blue-400' },
        { time: '11:00 AM', title: 'Previous Year Questions - Physics', type: 'practice', duration: '2h', icon: Book, color: 'text-green-400' },
        { time: '02:00 PM', title: 'Mock Test Analysis', type: 'test', duration: '1h', icon: Clock, color: 'text-orange-400' },
        { time: '04:00 PM', title: 'Group Study: Biology', type: 'group', duration: '1.5h', icon: Users, color: 'text-purple-400' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold tracking-tight">Today's Schedule</h2>
                <Button variant="outline" className="gap-2">
                    <Calendar className="w-4 h-4" /> View Calendar
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {events.map((event, i) => (
                        <div key={i} className="glass-card p-4 flex items-center gap-6 group hover:border-primary/50 transition-colors">
                            <div className="flex flex-col items-center min-w-[80px]">
                                <span className="text-sm font-medium text-muted-foreground">{event.time}</span>
                                <div className="h-full w-px bg-border/50 my-2" />
                            </div>

                            <div className={`p-3 rounded-xl bg-secondary ${event.color} bg-opacity-10`}>
                                <event.icon className="w-6 h-6" />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-lg">{event.title}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground uppercase font-medium">
                                        {event.type}
                                    </span>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {event.duration}
                                    </span>
                                </div>
                            </div>

                            <div className="hidden sm:block">
                                <Button variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    Details
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Up Next / Countdown */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 bg-gradient-to-b from-primary/10 to-transparent border-primary/20">
                        <h3 className="text-sm font-medium text-primary mb-1">UP NEXT</h3>
                        <h2 className="text-2xl font-bold mb-4">Live: Organic Chemistry</h2>
                        <div className="flex gap-2 mb-6">
                            <div className="bg-background/50 px-3 py-2 rounded-lg text-center min-w-[60px]">
                                <div className="text-xl font-bold">00</div>
                                <div className="text-[10px] text-muted-foreground uppercase">Hours</div>
                            </div>
                            <div className="text-2xl font-bold self-center">:</div>
                            <div className="bg-background/50 px-3 py-2 rounded-lg text-center min-w-[60px]">
                                <div className="text-xl font-bold">15</div>
                                <div className="text-[10px] text-muted-foreground uppercase">Mins</div>
                            </div>
                        </div>
                        <Button className="w-full shadow-lg shadow-primary/20">Join Session</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
