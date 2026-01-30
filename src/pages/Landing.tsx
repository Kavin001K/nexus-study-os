import { KnowledgeGraph } from '@/components/landing/KnowledgeGraph';
import { HeroSection } from '@/components/landing/HeroSection';
import { ActivityTicker } from '@/components/landing/ActivityTicker';
import { CommandPalette } from '@/components/CommandPalette';
import { useAppStore } from '@/store/useAppStore';

export default function Landing() {
  const { setCommandPaletteOpen } = useAppStore();
  
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* 3D Background */}
      <KnowledgeGraph />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-chart-2/5 pointer-events-none" />
      
      {/* Hero Content */}
      <HeroSection />
      
      {/* Activity Ticker */}
      <ActivityTicker />
      
      {/* Command Palette */}
      <CommandPalette />
      
      {/* Keyboard Hint */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40">
        <button 
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Press</span>
          <kbd className="px-2 py-1 rounded bg-secondary text-secondary-foreground font-mono text-xs">
            ⌘K
          </kbd>
          <span>to open command menu</span>
        </button>
      </div>
    </div>
  );
}
