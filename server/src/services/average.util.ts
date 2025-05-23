import type { DeckCard, Vote } from '@prisma/client';
export function calculateAverage(cards: DeckCard[], votes: Vote[]) {
  const numeric = votes
    .map((v) => cards.find((c) => c.id === v.cardId))
    .filter((c): c is DeckCard & { value: number } => !!c && c.value !== null);
  if (!numeric.length) return null;
  const sum = numeric.reduce((s, c) => s + (c.value || 0), 0);
  return +(sum / numeric.length).toFixed(1);
}
