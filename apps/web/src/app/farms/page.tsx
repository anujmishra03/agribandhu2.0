'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectFarms() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard/farms');
  }, [router]);
  return null;
}
