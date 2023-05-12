import { createRouter } from './context';
import { z } from 'zod';
import { prisma } from '../db/client';

export const tournamentRouter = createRouter()
  .query('get-all', {
    async resolve() {
      const allTournaments = prisma.tournament.findMany({
        include: {
          participants: {
            select: {
              id: true,
              name: true,
            },
          },
          winner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return allTournaments;
    },
  })
  .mutation('create', {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ input }) {
      const newTournament = await prisma.tournament.create({
        data: {
          name: input.name,
        },
      });

      return { success: true, tournament: newTournament };
    },
  })
  .mutation('add-participant', {
    input: z.object({
      tournamentId: z.string(),
      userId: z.string(),
    }),
    async resolve({ input }) {
      const updatedTournament = await prisma.tournament.update({
        where: {
          id: input.tournamentId,
        },
        data: {
          participants: {
            connect: {
              id: input.userId,
            },
          },
        },
      });

      return { success: true, data: updatedTournament };
    },
  })
  .mutation('remove-participant', {
    input: z.object({
      tournamentId: z.string(),
      userId: z.string(),
    }),
    async resolve({ input }) {
      const updatedTournament = await prisma.tournament.update({
        where: {
          id: input.tournamentId,
        },
        data: {
          participants: {
            disconnect: {
              id: input.userId,
            },
          },
        },
      });

      return { success: true, data: updatedTournament };
    },
  });
