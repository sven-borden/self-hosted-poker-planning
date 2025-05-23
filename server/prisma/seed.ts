import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Fibonacci
  await prisma.deck.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Fibonacci',
      cards: {
        create: [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100].map((v, i) => ({
          label: String(v),
          value: v,
          order: i,
        })),
      },
    },
  });

  // T‑Shirt
  await prisma.deck.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'T‑Shirt',
      cards: {
        create: ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((l, i) => ({
          label: l,
          value: null,
          order: i,
        })),
      },
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
