import { useState, Suspense, lazy } from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { ActivityTicker } from '@/components/landing/ActivityTicker';
import { CommandPalette } from '@/components/CommandPalette';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Layers, List } from 'lucide-react';
import { KnowledgeList } from '@/components/landing/KnowledgeList';

// Lazy load heavy Three.js component
const KnowledgeGraph = lazy(() => import('@/components/landing/KnowledgeGraph').then(module => ({ default: module.KnowledgeGraph })));

export default function Landing() {
  const { setCommandPaletteOpen } = useAppStore();
  const [show3D, setShow3D] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* View Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 glass-card hover:bg-secondary/50 backdrop-blur-md"
          onClick={() => setShow3D(!show3D)}
        >
          {show3D ? <List className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
          <span className="hidden sm:inline">{show3D ? 'List View' : 'Graph View'}</span>
        </Button>
      </div>

      {show3D ? (
        <>
          {/* 3D Background */}
          <Suspense fallback={<div className="fixed inset-0 bg-background/50" />}>
            <KnowledgeGraph />
          </Suspense>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/50 to-background/90 pointer-events-none z-0" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,background_80%)] pointer-events-none z-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-chart-2/5 pointer-events-none z-0" />

          {/* Hero Content */}
          <HeroSection />

          {/* Activity Ticker */}
          <ActivityTicker />
        </>
      ) : (
        <KnowledgeList />
      )}

      {/* Command Palette */}
      <CommandPalette />

      {/* Keyboard Hint - Only in 3D Mode to avoid clutter in list */}
      {show3D && (
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
      )}
    </div>
  );
}
