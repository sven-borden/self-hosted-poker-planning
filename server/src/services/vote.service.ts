import type { PrismaClient } from '@prisma/client';
export class VoteService {
  constructor(private prisma: PrismaClient) {}

  async cast(roomId: string, userId: string, cardId: number) {
    return this.prisma.vote.upsert({
      where: { userId_roomId_round: { userId, roomId, round: 1 } },
      update: { cardId },
      create: { roomId, userId, cardId, round: 1 },
    });
  }
}
