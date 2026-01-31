import { useRooms, useJoinRoom } from '@/hooks/queries';
import { Users, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function StudyRooms() {
    const { data: rooms = [] } = useRooms();
    const { mutate: joinRoom } = useJoinRoom();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Study Rooms</h2>
                    <p className="text-muted-foreground">Collaborate with peers in focused study groups</p>
                </div>
                <Button>
                    Create Room
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <div key={room.id} className="glass-card p-6 hover:border-primary/50 transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground uppercase tracking-wider">
                                {room.exam}
                            </span>
                            <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full bg-background/50 border border-border/50
                ${room.activityLevel === 'high' ? 'text-green-400 border-green-500/20' :
                                    room.activityLevel === 'medium' ? 'text-yellow-400 border-yellow-500/20' : 'text-blue-400 border-blue-500/20'}
              `}>
                                <span className={`w-1.5 h-1.5 rounded-full ${room.activityLevel === 'high' ? 'bg-green-400 animate-pulse' :
                                    room.activityLevel === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'}
                `} />
                                {room.activityLevel.toUpperCase()} ACTIVITY
                            </div>
                        </div>

                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{room.name}</h3>
                        <p className="text-sm text-muted-foreground mb-6 h-10 line-clamp-2">{room.description}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-border/30">
                            <div className="flex gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Users className="w-4 h-4" /> {room.memberCount}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <BookOpen className="w-4 h-4" /> {room.contentCount}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 hover:bg-primary/10 hover:text-primary"
                                onClick={() => joinRoom(room.id)}
                            >
                                Join <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
