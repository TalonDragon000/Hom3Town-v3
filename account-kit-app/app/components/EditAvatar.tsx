'use client';

import { useRouter } from 'next/navigation';

export default function EditAvatar() {
  const router = useRouter();

  return (
    <button 
      className="btn text-xl mt-6"
      onClick={() => router.push('/create-avatar')}
    >
      Edit
    </button>
  );
}