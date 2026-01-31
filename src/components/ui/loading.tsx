import { Zap } from 'lucide-react';

export function LoadingSpinner() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="relative flex items-center justify-center">
                <div className="h-16 w-16 animate-ping rounded-full bg-primary/20 opacity-75"></div>
                <div className="absolute animate-pulse">
                    <Zap className="h-8 w-8 text-primary fill-current" />
                </div>
            </div>
        </div>
    );
}

export function ComponentLoader() {
    return (
        <div className="flex h-full w-full items-center justify-center min-h-[300px]">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    );
}
