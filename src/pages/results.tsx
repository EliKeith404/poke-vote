import { NextPage } from 'next';
import Image from 'next/image';
import React from 'react';
import { inferQueryOutput, trpc } from '../utils/trpc';

const Results: NextPage = (props) => {
  // Get Pokemon ordered by most votesFor
  const {
    data: rankedPokemon,
    refetch,
    isLoading,
  } = trpc.useQuery(['poke.get-ranking'], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading || !rankedPokemon || !rankedPokemon[0]) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl py-10 mx-10">Results</h1>
      <div>
        {rankedPokemon
          .sort((a, b) => {
            const difference = calcVotePercent(b) - calcVotePercent(a);

            if (difference === 0) {
              return b._count.votesFor - a._count.votesFor;
            }

            return difference;
          })
          .map((pokemon, i) => {
            return <PokemonListItem pokemon={pokemon} rank={i + 1} key={i} />;
          })}
      </div>
    </div>
  );
};

export default Results;

type PokemonQueryResult = inferQueryOutput<'poke.get-ranking'>[0];

const PokemonListItem: React.FC<{
  pokemon: PokemonQueryResult;
  rank: number;
}> = ({ pokemon, rank }) => {
  return (
    <div className="grid grid-cols-4 md:grid-cols-6 border mx-10 px-10">
      <span className="md:col-start-2 m-auto">#{rank}</span>
      <div>
        <Image
          src={pokemon.spriteUrl}
          alt={`${pokemon.name}'s Sprite Image`}
          width={128}
          height={128}
        />
      </div>
      <div className="flex flex-col items-center px-5 m-auto">
        <p className="text-xs">{pokemon.id}</p>
        <p className="capitalize md:text-lg">{pokemon.name}</p>
      </div>
      <p className="px-5 m-auto">{calcVotePercent(pokemon).toFixed(2)}%</p>
    </div>
  );
};

const calcVotePercent = (pokemon: PokemonQueryResult) => {
  const { votesFor, votesAgainst } = pokemon._count;
  if (votesFor + votesAgainst === 0) return 0;

  return (votesFor / (votesFor + votesAgainst)) * 100;
};
