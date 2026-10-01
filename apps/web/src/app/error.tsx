'use client';

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@agribandhu/ui';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log error to an analytics service in production
    console.error('Unhandled app boundary error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center gap-6 bg-white px-4">
      <div className="rounded-full bg-destructive-50 p-4 text-destructive">
        <AlertTriangle className="h-10 w-10 animate-bounce" />
      </div>
      <div className="text-center space-y-2 max-w-sm">
        <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
          Something went wrong!
        </h2>
        <p className="text-neutral-500 text-sm leading-relaxed">
          An unexpected error occurred while loading this page. Please try resetting the view or contact support if the issue persists.
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => reset()} size="default">
          Try Again
        </Button>
        <Button onClick={() => (window.location.href = '/')} variant="outline" size="default">
          Go Back Home
        </Button>
      </div>
    </div>
  );
}
