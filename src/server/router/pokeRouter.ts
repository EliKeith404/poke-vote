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
      await prisma.pokemon.upsert({
        where: {
          id: input.votedFor.id,
        },
        update: {
          name: input.votedFor.name,
        },
        create: {
          id: input.votedFor.id,
          name: input.votedFor.name,
          spriteUrl: input.votedFor.spriteUrl,
        },
      });

      await prisma.pokemon.upsert({
        where: {
          id: input.votedAgainst.id,
        },
        update: {
          name: input.votedAgainst.name,
        },
        create: {
          id: input.votedAgainst.id,
          name: input.votedAgainst.name,
          spriteUrl: input.votedAgainst.spriteUrl,
        },
      });

      const voteInDb = await prisma.vote.create({
        data: {
          votedForId: input.votedFor.id,
          votedAgainstId: input.votedAgainst.id,
        },
      });

      return { success: true, vote: voteInDb };
    },
  });
