import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { NativeSelect, Paper } from '@mantine/core';
import Head from 'next/head';
import { Category } from '@prisma/client';
import { inferQueryOutput, trpc } from '../utils/trpc';

// Get type of object returned from the database
type PokemonRankingResult = inferQueryOutput<'poke.get-ranking'>;

const calcVotePercent = (votesFor: number, votesAgainst: number) => {
  if (votesFor + votesAgainst === 0) return 0;

  return (votesFor / (votesFor + votesAgainst)) * 100;
};

const calcTopTenPokemon = (pokemonList: PokemonRankingResult) => {
  const pokeListRanked = [];

  for (const pokemon of pokemonList) {
    const { votesFor, votesAgainst } = pokemon._count;
    const votePercent = calcVotePercent(votesFor, votesAgainst);

    const pokeObject = {
      name: pokemon.name,
      id: pokemon.id,
      votesFor: votesFor,
      votesAgainst: votesAgainst,
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

const Results = () => {
  // States
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    Category.roundest
  );
  const [pokemonListRanked, setPokemonListRanked] = useState<ReturnType<
    typeof calcTopTenPokemon
  > | null>(null);

  // Get data from database
  const { data: pokemonVoteCount, refetch } = trpc.useQuery(
    ['poke.get-ranking', { category: selectedCategory }],
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  // Recalculate data when category is changed
  useEffect(() => {
    if (pokemonVoteCount != null) {
      setPokemonListRanked(calcTopTenPokemon(pokemonVoteCount));
    }
  }, [pokemonVoteCount]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.currentTarget.value as keyof typeof Category);
    refetch();
  };

  //if (isLoading || !pokemonListRanked || !pokemonVoteCount)
  // return <div>Loading...</div>;

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
            onChange={(e) => handleCategoryChange(e)}
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
