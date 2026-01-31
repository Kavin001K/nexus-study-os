import { useState } from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { login, isLoading } = useAppStore();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/dashboard');
    }
  };

  const handleGoogleSignIn = async () => {
    // Simulate a Google User for the demo
    const success = await login(
      'user@example.com',
      'Demo User',
      undefined
    );

    if (success) {
      navigate('/dashboard');
    }
  };

  const suggestions = [
    'Master Organic Chemistry for NEET',
    'Complete JEE Physics in 30 days',
    'Indian Constitution for UPSC',
    'Calculus problems with solutions',
  ];

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
      {/* Logo and Title */}
      <div className="mb-8 animate-float">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full glass-card">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">
            AI-Powered Knowledge OS
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
          <span className="gradient-text">Nexus</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Transform your exam preparation into an immersive,
          <span className="text-foreground font-medium"> AI-powered </span>
          collaborative experience
        </p>
      </div>

      {/* Semantic Search Bar */}
      <form
        onSubmit={handleSearch}
        className={`
          w-full max-w-2xl mb-8 transition-all duration-300
          ${isSearchFocused ? 'scale-105' : ''}
        `}
      >
        <div className={`
          relative glass-panel p-1.5 transition-all duration-300
          ${isSearchFocused ? 'glow-sm' : ''}
        `}>
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="What do you want to master today?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full pl-12 pr-32 py-6 text-lg bg-transparent border-0 focus-visible:ring-0 placeholder:text-muted-foreground/60"
            />
            <Button
              type="submit"
              size="lg"
              className="absolute right-2 gap-2"
            >
              Explore
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Search Suggestions */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 p-2 glass-panel rounded-lg">
              <p className="px-3 py-2 text-xs text-muted-foreground uppercase tracking-wider">
                Popular searches
              </p>
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSearchQuery(suggestion)}
                  className="w-full px-3 py-2 text-left text-sm rounded-md hover:bg-secondary/50 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </form>

      {/* Auth Section */}
      <div className="flex flex-col items-center gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="relative group overflow-hidden pl-6 pr-8 py-6 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 text-foreground transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 relative z-10">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span className="font-semibold text-lg">
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </span>
          </div>
        </Button>

        <p className="text-sm text-muted-foreground">
          Join <span className="text-foreground font-medium">50,000+</span> aspirants preparing smarter
        </p>
      </div>

      {/* Exam Pills */}
      <div className="flex flex-wrap justify-center gap-3 mt-12">
        {['JEE Main', 'JEE Advanced', 'NEET', 'UPSC CSE', 'UPSC CAPF'].map((exam) => (
          <span
            key={exam}
            className="px-4 py-2 text-sm rounded-full glass-card text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all cursor-pointer"
          >
            {exam}
          </span>
        ))}
      </div>
    </div>
  );
}
