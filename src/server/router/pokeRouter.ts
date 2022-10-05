import { createRouter } from './context';
import { z } from 'zod';

import { getOptionsForVote } from '../../utils/getRandomPokemon';
import { prisma } from '../db/client';

export const pokeRouter = createRouter()
  .query('get-pokemon-pair', {
    async resolve() {
      const { firstId, secondId } = getOptionsForVote();

      const bothPokemon = await prisma.pokemon.findMany({
        where: { id: { in: [firstId, secondId] } },
      });

      if (bothPokemon[0] == null || bothPokemon[1] == null) {
        throw new Error('Failed to find 2 Pokemon');
      }

      const pokemon = {
        first: bothPokemon[0],
        second: bothPokemon[1],
      };

      return pokemon;
    },
  })
  .query('get-ranking', {
    async resolve() {
      const topTen = await prisma.pokemon.findMany({
        orderBy: { votesFor: { _count: 'desc' } },
        select: {
          id: true,
          name: true,
          spriteUrl: true,
          _count: {
            select: { votesFor: true, votesAgainst: true },
          },
        },
        take: 10,
      });

      return topTen;
    },
  })
  .mutation('cast-vote', {
    input: z.object({
      votedFor: z.object({
        id: z.number(),
        name: z.string(),
        spriteUrl: z.string(),
      }),
      votedAgainst: z.object({
        id: z.number(),
        name: z.string(),
        spriteUrl: z.string(),
      }),
    }),
    async resolve({ input }) {
      const voteInDb = await prisma.vote.create({
        data: {
          votedForId: input.votedFor.id,
          votedAgainstId: input.votedAgainst.id,
        },
      });

      return { success: true, vote: voteInDb };
    },
  });
