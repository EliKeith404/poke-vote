import { GetServerSideProps } from 'next';
import Image from 'next/image';
import React from 'react';
import { prisma } from '../server/db/client';
import { inferAsyncReturnType } from '@trpc/server';
import { Paper } from '@mantine/core';

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

export const getServerSideProps: GetServerSideProps = async () => {
  // Get top 10 pokemon based on votesFor count
  const rankedPokemon = await getRankedPokemon();
  //const HOUR_IN_SEC = 1 * 60 * 60;

  return {
    props: {
      rankedPokemon: rankedPokemon,
    },
  };
};

const Results = ({ rankedPokemon }: { rankedPokemon: PokemonQueryResult }) => {
  if (!rankedPokemon) return <div>Loading...</div>;

  return (
    <div className="max-w-[900px] mx-auto md:px-5">
      <h1 className="text-2xl md:text-3xl">Results</h1>
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

const PokemonListItem = ({
  pokemon,
  rank,
}: {
  pokemon: PokemonQueryResult[0];
  rank: number;
}) => {
  return (
    <Paper className="grid grid-cols-4 mx-auto px-3 md:px-10" withBorder>
      <span className="text-sm md:text-lg m-auto">#{rank}</span>
      <div className="mx-auto">
        <Image
          src={pokemon.spriteUrl}
          alt={`${pokemon.name}'s Sprite Image`}
          width={112}
          height={112}
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
      <div className="flex flex-col items-center m-auto">
        <span className="text-xs">{pokemon.id}</span>
        <span className="capitalize text-sm md:text-lg">{pokemon.name}</span>
      </div>
      <p className="text-sm md:text-lg px-5 m-auto">
        {calcVotePercent(pokemon).toFixed(2)}%
      </p>
    </Paper>
  );
};
