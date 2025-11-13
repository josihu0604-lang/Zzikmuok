// ZZIK LIVE - Root Page (Redirects to Home)
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/home');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-purple-600">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white animate-pulse" />
        <h1 className="text-2xl font-bold text-white">ZZIK LIVE</h1>
        <p className="text-white/80 mt-2">Loading...</p>
      </div>
    </div>
  );
}
