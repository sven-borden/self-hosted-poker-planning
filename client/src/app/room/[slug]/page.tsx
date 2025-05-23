'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { connect } from '../../../lib/socket';
import Card from '../../../components/Card';
import ResultPanel from '../../../components/ResultPanel';

export default function RoomPage() {
  const { slug } = useParams();
  const [socket, setSocket] = useState<any>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const s = connect(slug as string);
    s.on('admin:reveal', () => setRevealed(true));
    s.on('admin:nextRound', () => {
      setSelected(null);
      setRevealed(false);
    });
    setSocket(s);
    return () => s.disconnect();
  }, [slug]);

  const deck = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100];

  function cast(value: number) {
    setSelected(value);
    socket?.emit('vote:cast', { cardId: value });
  }

  return (
    <main className="p-6">
      <h2 className="text-2xl font-bold mb-4">Room {slug}</h2>
      <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
        {deck.map((v) => (
          <Card
            key={v}
            label={String(v)}
            selected={selected === v}
            onSelect={() => cast(v)}
            disabled={revealed}
          />
        ))}
      </div>
      {revealed && <ResultPanel />}
    </main>
  );
}
