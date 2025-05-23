'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');

  async function createRoom() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deckId: 1, userName: name }),
    });
    const { slug } = await res.json();
    router.push(`/room/${slug}`);
  }

  return (
    <main className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-3xl font-bold">Planning Poker</h1>
      <input
        className="border p-2 rounded"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={createRoom}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Room
      </button>
    </main>
  );
}
