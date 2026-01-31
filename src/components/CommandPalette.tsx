import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useRooms } from '@/hooks/queries';
import { useAppStore } from '@/store/useAppStore';
import {
  Search,
  Upload,
  BookOpen,
  Users,
  Settings,
  Moon,
  Sun,
  Home,
  Compass,
  MessageSquare,
  Zap,
} from 'lucide-react';

export function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useAppStore();
  const { data: goalRooms = [] } = useRooms();
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  const runCommand = (command: () => void) => {
    setCommandPaletteOpen(false);
    command();
  };

  return (
    <CommandDialog open={isCommandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate('/'))}>
            <Home className="mr-2 h-4 w-4" />
            <span>Home</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/dashboard'))}>
            <Compass className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/rooms'))}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Browse Goal Rooms</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => console.log('Upload'))}>
            <Upload className="mr-2 h-4 w-4" />
            <span>Upload Notes</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>U
            </kbd>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => console.log('AI Chat'))}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Ask Socratic Bot</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>J
            </kbd>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => console.log('Quiz'))}>
            <Zap className="mr-2 h-4 w-4" />
            <span>Start Sprint Quiz</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Goal Rooms">
          {goalRooms.slice(0, 5).map((room) => (
            <CommandItem
              key={room.id}
              onSelect={() => runCommand(() => navigate(`/room/${room.id}`))}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              <span>{room.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {room.memberCount.toLocaleString()} members
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(() => console.log('Settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
