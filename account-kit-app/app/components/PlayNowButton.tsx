'use client';

import { useRouter } from 'next/navigation';

export default function PlayNowButton() {
  const router = useRouter();

  return (
    <button 
      className="flex w-full justify-center btn btn-hover text-xl mt-6"
      onClick={() => router.push('/create-avatar')}
    >
      PLAY NOW
    </button>
  );
}