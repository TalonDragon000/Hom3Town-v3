'use client';

import { useRouter } from 'next/navigation';

export default function ReturnHomeBtn() {
  const router = useRouter();

  return (
    <button 
      className="btn btn-hover text-xl mt-6"
      onClick={() => router.push('/dashboard')}
    >
      Return Home
    </button>
  );
}