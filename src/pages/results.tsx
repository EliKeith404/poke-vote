import { GetServerSideProps } from 'next';
import Image from 'next/image';
import React from 'react';
import { prisma } from '../server/db/client';
import { inferAsyncReturnType } from '@trpc/server';

// Get Pokemon from database, ordered by vote count
const getRankedPokemon = async () => {
  return await prisma.pokemon.findMany({
    orderBy: { votesFor: { _count: 'desc' } },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: { votesFor: true, votesAgainst: true },
      },
    },
    take: 100,
  });
};

// Get type of object returned from the database
type PokemonQueryResult = inferAsyncReturnType<typeof getRankedPokemon>;

const calcVotePercent = (pokemon: PokemonQueryResult[0]) => {
  const { votesFor, votesAgainst } = pokemon._count;
  if (votesFor + votesAgainst === 0) return 0;

  return (votesFor / (votesFor + votesAgainst)) * 100;
};

export const getStaticProps: GetServerSideProps = async () => {
  // Get top 10 pokemon based on votesFor count
  const topTen = await getRankedPokemon();
  const HOUR_IN_SEC = 1 * 60 * 60;

  return {
    props: {
      rankedPokemon: topTen,
    },
    revalidate: HOUR_IN_SEC,
  };
};

const Results: React.FC<{ rankedPokemon: PokemonQueryResult }> = ({
  rankedPokemon,
}) => {
  if (!rankedPokemon) return <div>Loading...</div>;

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
          .slice(0, 10)
          .map((pokemon, i) => {
            return <PokemonListItem pokemon={pokemon} rank={i + 1} key={i} />;
          })}
      </div>
    </div>
  );
};

export default Results;

////////////////////////////////
// Pokemon Ranking List Item

const PokemonListItem: React.FC<{
  pokemon: PokemonQueryResult[0];
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
