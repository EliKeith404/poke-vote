import { GetStaticProps } from 'next';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { inferAsyncReturnType } from '@trpc/server';
import { NativeSelect, Paper } from '@mantine/core';
import Head from 'next/head';
import { Category } from '@prisma/client';
import getPokemonWithVotes from '../lib/getPokemonWithVotes';

export const getStaticProps: GetStaticProps = async () => {
  const pokemon = await getPokemonWithVotes();
  const TWELVE_HOUR_IN_SEC = 12 * 60 * 60; // Every 12 hours, refetch data

  return {
    props: {
      pokemonList: pokemon,
    },
    revalidate: TWELVE_HOUR_IN_SEC,
  };
};

// Get type of object returned from the database
type PokemonQueryResult = inferAsyncReturnType<typeof getPokemonWithVotes>;

const calcVotePercent = (votesFor: number, votesAgainst: number) => {
  if (votesFor + votesAgainst === 0) return 0;

  return (votesFor / (votesFor + votesAgainst)) * 100;
};

const calcTopTenPokemon = (
  pokemonList: PokemonQueryResult,
  category: Category
) => {
  const pokeListRanked = [];

  for (const pokemon of pokemonList) {
    const votesForCount = pokemon.votesFor.filter(
      (vote) => vote.category === category
    ).length;
    const votesAgainstCount = pokemon.votesAgainst.filter(
      (vote) => vote.category === category
    ).length;

    const votePercent = calcVotePercent(votesForCount, votesAgainstCount);

    const pokeObject = {
      name: pokemon.name,
      id: pokemon.id,
      votesFor: votesForCount,
      votesAgainst: votesAgainstCount,
      votePercent: votePercent,
    };

    pokeListRanked.push(pokeObject);
  }

  // Return the sorted top 10 pokemon of the category
  return pokeListRanked
    .sort((a, b) => {
      const difference = b.votePercent - a.votePercent;

      if (difference === 0) {
        return b.votesFor - a.votesFor;
      }

      return difference;
    })
    .slice(0, 10);
};

const Results = ({ pokemonList }: { pokemonList: PokemonQueryResult }) => {
  // States
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    Category.roundest
  );
  const [pokemonListRanked, setPokemonListRanked] = useState<ReturnType<
    typeof calcTopTenPokemon
  > | null>(null);

  // useEffect to update the pokemon list when the category input is changed
  useEffect(() => {
    const pokemonVoteCount = calcTopTenPokemon(pokemonList, selectedCategory);
    setPokemonListRanked(pokemonVoteCount);
  }, [pokemonList, selectedCategory]);

  if (!pokemonList || !pokemonListRanked) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>Results | PokeVote</title>
        {/* Open Graph Meta */}
        <meta property="og:title" content="Results | PokeVote" />
        <meta
          name="description"
          property="og:description"
          content="Statistical, objective, and non-biased calculations on the characteristics of the 905 Pokemon."
        />
        <meta
          name="image"
          property="og:image"
          content="/preview-images/resultsPreview.jpg"
        />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@elikeith404" />
        <meta name="twitter:title" content="Results | PokeVote" />
        <meta
          name="twitter:description"
          content="Statistical, objective, and non-biased calculations on the characteristics of the 905 Pokemon."
        />
        <meta
          name="twitter:image"
          content="https://poke-vote-elikeith404.vercel.app/preview-images/resultsPreview.jpg"
        />
        <meta
          name="twitter:image:alt"
          content="PokeVote's top 10 results page"
        />
      </Head>
      <div className="max-w-[900px] mx-auto md:px-5">
        <h1 className="text-2xl md:text-3xl">Results</h1>
        <div className="grid grid-cols-2 pb-5">
          <NativeSelect
            className="col-span-2 md:col-span-1"
            data={Object.keys(Category)}
            label="Category"
            onChange={(e) =>
              setSelectedCategory(
                e.currentTarget.value as keyof typeof Category
              )
            }
          />
        </div>
        <div>
          {pokemonListRanked &&
            pokemonListRanked.map((pokemon, i) => {
              return <PokemonListItem pokemon={pokemon} rank={i + 1} key={i} />;
            })}
        </div>
      </div>
    </>
  );
};

export default Results;

////////////////////////////////
// Pokemon Ranking List Item

const PokemonListItem = ({
  pokemon,
  rank,
}: {
  pokemon: ReturnType<typeof calcTopTenPokemon>[0];
  rank: number;
}) => {
  return (
    <Paper className="grid grid-cols-4 mx-auto px-3 md:px-10" withBorder>
      <span className="text-sm md:text-lg m-auto">#{rank}</span>
      <div className="mx-auto">
        <Image
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
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
        {pokemon.votePercent.toFixed(2)}%
      </p>
    </Paper>
  );
};
