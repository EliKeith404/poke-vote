import { createRouter } from './context';
import { z } from 'zod';
import { prisma } from '../db/client';
import getVoteCategory from '../../utils/getVoteCategory';

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
  .query('get-stats', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const userVoteCount = await prisma.user.findFirst({
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

      const userTournaments = await prisma.tournament.findMany({
        where: {
          participants: {
            some: {
              id: {
                contains: input.id,
              },
            },
          },
        },
      });

      return {
        votes: userVoteCount?._count.votes,
        tournaments: userTournaments,
      };
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
  })
  .query('get-votes', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const userVoteCount = await prisma.vote.count({
        where: {
          submittedById: input.id,
        },
      });

      return userVoteCount;
    },
  })
  .mutation('assign-category', {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ input }) {
      const generatedCategory = getVoteCategory();

      const updatedUser = await prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          assignedCategory: generatedCategory,
        },
      });

      return { success: true, data: updatedUser };
    },
  })
  .mutation('remove-category', {
    input: z.object({
      userIds: z.string().array(),
    }),
    async resolve({ input }) {
      const updatedUsers = await prisma.user.updateMany({
        where: {
          id: {
            in: input.userIds,
          },
        },
        data: {
          assignedCategory: null,
        },
      });

      return { success: true, data: updatedUsers };
    },
  });
