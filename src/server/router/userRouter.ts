import { createRouter } from './context';
import { z } from 'zod';
import { prisma } from '../db/client';

export const userRouter = createRouter()
  .query('get-vote-count', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const userVotes = await prisma.user.findUnique({
        where: {
          id: input.id,
        },
        select: {
          _count: {
            select: {
              votes: true,
            },
          },
        },
      });

      return userVotes?._count.votes;
    },
  })
  .query('get-user', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const user = await prisma.user.findUnique({
        where: {
          id: input.id,
        },
        select: {
          name: true,
          image: true,
          assignedCategory: true,
        },
      });

      return user;
    },
  });
