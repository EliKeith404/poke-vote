import { createRouter } from './context';
import { z } from 'zod';
import { prisma } from '../db/client';

import { getOptionsForVote } from '../../utils/getRandomPokemon';
import { Category } from '@prisma/client';
import getRandomEnum from '../../utils/getRandomEnum';

export const pokeRouter = createRouter()
  .query('get-pokemon-pair', {
    async resolve() {
      const { firstId, secondId } = getOptionsForVote();

      const bothPokemon = await prisma.pokemon.findMany({
        where: { id: { in: [firstId, secondId] } },
        select: {
          id: true,
          name: true,
        },
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
    input: z.object({
      category: z.nativeEnum(Category),
    }),
    async resolve({ input }) {
      const pokemonVotes = await prisma.pokemon.findMany({
        select: {
          id: true,
          name: true,
          votesFor: { where: { category: input.category } },
          votesAgainst: { where: { category: input.category } },
        },
      });

      return pokemonVotes;
    },
  })
  .mutation('randomize-category', {
    input: z.object({
      userid: z.string(),
    }),
    async resolve({ input }) {
      const randCategory = getRandomEnum(Category) as keyof typeof Category;

      const randomizedDb = await prisma.user.update({
        where: {
          id: input.userid,
        },
        data: {
          assignedCategory: randCategory,
        },
      });

      return { success: true, randCat: randomizedDb };
    },
  })
  .mutation('cast-vote', {
    input: z.object({
      category: z.nativeEnum(Category),
      votedFor: z.object({
        id: z.number(),
        name: z.string(),
      }),
      votedAgainst: z.object({
        id: z.number(),
        name: z.string(),
      }),
    }),
    async resolve({ input }) {
      const voteInDb = await prisma.vote.create({
        data: {
          category: input.category,
          votedForId: input.votedFor.id,
          votedAgainstId: input.votedAgainst.id,
        },
      });

      return { success: true, vote: voteInDb };
    },
  });
