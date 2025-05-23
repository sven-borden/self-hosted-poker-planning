// Placeholder for more complex domain logic
import type { PrismaClient } from '@prisma/client';
export class RoomService {
  constructor(private prisma: PrismaClient) {}

  async getRoomBySlug(slug: string) {
    return this.prisma.room.findUnique({ where: { slug } });
  }
}
