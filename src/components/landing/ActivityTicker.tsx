import { useActivities } from '@/hooks/queries';
import { formatDistanceToNow } from 'date-fns';
import { Upload, Award, MessageSquare, CheckCircle, Flame } from 'lucide-react';

const actionIcons: Record<string, typeof Upload> = {
  uploaded: Upload,
  completed: CheckCircle,
  shared: Upload,
  asked: MessageSquare,
  earned: Award,
  streak: Flame,
  bounty: Award,
};

function getActionIcon(action: string) {
  for (const [key, Icon] of Object.entries(actionIcons)) {
    if (action.toLowerCase().includes(key)) {
      return Icon;
    }
  }
  return Upload;
}

export function ActivityTicker() {
  const { data } = useActivities(20);
  const activityFeed = Array.isArray(data) ? data : [];

  // Duplicate the feed for seamless loop
  const duplicatedFeed = [...activityFeed, ...activityFeed];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 overflow-hidden glass-heavy border-t border-border/30">
      <div className="py-3 flex animate-ticker" style={{ width: 'max-content' }}>
        {duplicatedFeed.map((item, i) => {
          const Icon = getActionIcon(item.action);
          return (
            <div
              key={`${item.id}-${i}`}
              className="flex items-center gap-3 px-6 border-r border-border/30"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                <span className="font-medium text-foreground">@{item.user}</span>
                <span className="text-muted-foreground">{item.action}</span>
                <span className="text-primary">• {item.room}</span>
                <span className="text-muted-foreground/60">
                  {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
