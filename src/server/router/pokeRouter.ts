import { createRouter } from './context';
import { z } from 'zod';

import { PokemonClient } from 'pokenode-ts';
import {
  getOptionsForVote,
  getRandomPokemon,
} from '../../utils/getRandomPokemon';
import { prisma } from '../db/client';

export const pokeRouter = createRouter()
  .query('generate-vote', {
    input: z.object({
      amount: z.number(),
    }),
    async resolve({ input }) {
      const api = new PokemonClient();

      let pokemon = {};

      try {
        for (let i = 0; i < input.amount; i++) {
          const serverPokemon = await api.getPokemonById(getRandomPokemon());
          const filteredPokemon = {
            id: serverPokemon.id,
            name: serverPokemon.name,
            spriteUrl: serverPokemon.sprites.front_default || '',
          };

          pokemon = {
            ...pokemon,
            [i]: filteredPokemon,
          };
        }
        console.log(pokemon);
      } catch (error) {
        console.error(error);
      }

      return pokemon;
    },
  })
  .query('get-pokemon-pair', {
    async resolve() {
      const api = new PokemonClient();
      const [first, second] = getOptionsForVote();

      const bothPokemon = await Promise.all([
        api.getPokemonById(first || 0),
        api.getPokemonById(second || 0),
      ]);

      if (bothPokemon.length !== 2) {
        throw new Error('Failed to find 2 Pokemon');
      }

      const bothFiltered = bothPokemon.map((poke) => {
        return {
          id: poke.id,
          name: poke.name,
          spriteUrl: poke.sprites.front_default || '',
        };
      });

      const pokemon = {
        first: bothFiltered[0],
        second: bothFiltered[1],
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
      const pokemon1Upsert = await prisma.pokemon.upsert({
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

      const pokemon2Upsert = await prisma.pokemon.upsert({
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
