import { Sprout } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center gap-4 bg-white">
      <div className="relative flex items-center justify-center">
        {/* Animated Spin Ring */}
        <div className="h-16 w-16 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin" />
        {/* Center Icon */}
        <Sprout className="absolute h-6 w-6 text-primary-600 animate-pulse" />
      </div>
      <p className="text-neutral-500 font-semibold text-sm tracking-wider uppercase animate-pulse">
        Loading AgriBandhu...
      </p>
    </div>
  );
}
