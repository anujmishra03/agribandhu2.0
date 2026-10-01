import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import { Button } from '@agribandhu/ui';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center gap-6 bg-white px-4">
      <div className="rounded-full bg-accent-yellow-50 p-4 text-accent-yellow-600">
        <HelpCircle className="h-10 w-10 animate-pulse" />
      </div>
      <div className="text-center space-y-2 max-w-sm">
        <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
          Page Not Found (404)
        </h2>
        <p className="text-neutral-500 text-sm leading-relaxed">
          The page you are looking for does not exist, has been removed, or has been temporarily relocated.
        </p>
      </div>
      <Link href="/">
        <Button size="default">Return Home</Button>
      </Link>
    </div>
  );
}
