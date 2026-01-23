import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();


if (process.env.NODE_ENV !== 'production') {
  prisma.$connect().catch(() => {});
}
