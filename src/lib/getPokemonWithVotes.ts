import { prisma } from '../server/db/client';

export default async function getPokemonWithVotes() {
  const pokemonList = await prisma.pokemon.findMany({
    select: {
      id: true,
      name: true,
      votesFor: { select: { category: true } },
      votesAgainst: { select: { category: true } },
    },
  });

  return pokemonList;
}
