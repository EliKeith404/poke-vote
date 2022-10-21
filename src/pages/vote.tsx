import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type React from 'react';
import { inferQueryOutput, trpc } from '../utils/trpc';
import { Button, Container, Paper, Space } from '@mantine/core';

import { Category } from '@prisma/client';
import getRandomEnum from '../utils/getRandomEnum';
import { useSession } from 'next-auth/react';

const VoteHeader = () => {
  return (
    <Head>
      <title>Voting | PokeVote</title>
      {/* Open Graph Meta */}
      <meta property="og:title" content="Voting | PokeVote" />
      <meta
        name="description"
        property="og:description"
        content="The voting platform. The point where your voice is heard. Vote categories are completely subjective and should be voted based on whatever that category means to you. Or do whatever you want I can't stop you."
      />
      <meta
        name="image"
        property="og:image"
        content="/preview-images/votePreview.jpg"
      />
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@elikeith404" />
      <meta name="twitter:title" content="Voting | PokeVote" />
      <meta
        name="twitter:description"
        content="The voting platform. The point where your voice is heard. Vote categories are completely subjective and should be voted based on whatever that category means to you. Or do whatever you want I can't stop you."
      />
      <meta
        name="twitter:image"
        content="https://poke-vote-elikeith404.vercel.app/preview-images/votePreview.jpg"
      />
      <meta
        name="twitter:image:alt"
        content="A vote between two pokemon on which is the roundest"
      />
    </Head>
  );
};

const colorMap = (category: Category) => {
  let color = 'text-white';

  switch (category) {
    case 'roundest':
      color = 'text-cyan-300';
      break;
    case 'sharpest':
      color = 'text-yellow-300';
      break;
    case 'meanest':
      color = 'text-red-400';
      break;
    case 'friendliest':
      color = 'text-pink-300';
      break;
    case 'wackiest':
      color = 'text-orange-300';
      break;
    case 'tastiest':
      color = 'text-pink-500';
      break;
    case 'rowdiest':
      color = 'text-green-300';
      break;
    default:
      break;
  }

  return color;
};

const VotePage: NextPage = () => {
  // Vote category, typing pulled from schema.prisma file
  const [category, setCategory] = useState<Category>(Category.roundest);
  const { data: session } = useSession();

  useEffect(() => {
    // TODO: Grab category from local storage and set it, if it doesnt exist, generate it.
    // Or finish login get/set
    const selectedCategory = getRandomEnum(Category);
    setCategory(Category[selectedCategory as keyof typeof Category]);
  }, []);

  // Grab 2 Pokemon from database
  const {
    data: pokemon,
    refetch,
    isLoading,
  } = trpc.useQuery(['poke.get-pokemon-pair'], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  // Vote Handler
  const voteMutation = trpc.useMutation(['poke.cast-vote']);

  const handleVote = (selected: number) => {
    if (!pokemon) return; // Early escape if pokemon could not be fetched

    if (selected === pokemon.first.id) {
      voteMutation.mutate({
        category: category,
        votedFor: pokemon.first,
        votedAgainst: pokemon.second,
      });
    } else {
      voteMutation.mutate({
        category: category,
        votedFor: pokemon.second,
        votedAgainst: pokemon.first,
      });
    }

    refetch();
  };

  // If the vote is loading or data is still being retrieved, disable buttons
  const fetchingNext = voteMutation.isLoading || isLoading;

  /////////////////////////////
  // Begin HTML Rendering

  if (isLoading || !pokemon) {
    return (
      <>
        <VoteHeader />
        <div>Loading...</div>
      </>
    );
  }

  return (
    <>
      <VoteHeader />
      <Container className="h-full flex flex-col justify-center items-center px-2">
        <h1 className="text-xl text-center">
          Which Pokemon is{' '}
          <span
            className={`capitalize underline underline-offset-[3px] ${colorMap(
              category
            )}`}
          >
            {category.slice(0, -2) + 'r'}
          </span>
          ?
        </h1>
        <Space h={25} />
        <Paper
          className="flex justify-evenly items-center w-full max-w-[620px] p-2 animate-fade-in"
          withBorder
          radius="lg"
        >
          <PokemonListing
            pokemon={pokemon.first}
            vote={() => handleVote(pokemon.first.id)}
            disabled={fetchingNext}
          />
          <span>vs.</span>
          <PokemonListing
            pokemon={pokemon.second}
            vote={() => handleVote(pokemon.second.id)}
            disabled={fetchingNext}
          />
        </Paper>
      </Container>
    </>
  );
};

export default VotePage;

// Pokemon Listing Component
type ServerType = inferQueryOutput<'poke.get-pokemon-pair'>['first'];

const PokemonListing = ({
  pokemon,
  vote,
  disabled,
}: {
  pokemon: ServerType;
  vote: () => void;
  disabled: boolean;
}) => {
  return (
    <div className={`flex flex-col justify-center items-center`}>
      <div
        className={`flex flex-col justify-center items-center transition-opacity ${
          disabled && 'opacity-0'
        }`}
      >
        <h2 className="text-sm md:text-xl capitalize">{pokemon.name}</h2>
        <div className="py-5 animate-fade-in">
          <Image
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
            alt={`${pokemon.name}'s sprite image`}
            width={192}
            height={192}
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      </div>

      <Button
        className="mb-2"
        color="yellow"
        radius="md"
        onClick={() => vote()}
        disabled={disabled}
      >
        Vote
      </Button>
    </div>
  );
};
