import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import type React from 'react';
import { trpc } from '../utils/trpc';
import {
  Button,
  Container,
  Image as MantineImage,
  Paper,
  Space,
} from '@mantine/core';
import { useSession } from 'next-auth/react';

import { Category } from '@prisma/client';
import getRandomCategory from '../utils/getRandomCategory';
import { getPokemonImage } from '../utils/getPokemonImage';
import { getOptionsForVote } from '../utils/getRandomPokemon';
import { ALL_POKEMON } from '../utils/allPokemon';

// Pokemon Server Output Types
interface PokemonType {
  firstId: number;
  secondId: number;
}

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

const fetchedImages: Set<number> = new Set();

const VotePage: NextPage = () => {
  // Vote category, typing pulled from schema.prisma file
  const [category, setCategory] = useState<Category>(Category.roundest);
  const [currentPair, setCurrentPair] = useState<PokemonType>(
    getOptionsForVote()
  );
  const [nextPair, setNextPair] = useState<PokemonType>(getOptionsForVote());
  const [mounted, setMounted] = useState<boolean>(false);

  const { data: session } = useSession();

  useEffect(() => {
    if (!mounted) setMounted(true);
  }, [mounted]);

  // Store current images
  useEffect(() => {
    Object.values(currentPair).forEach((id) => {
      fetchedImages.add(id);
    });
  }, [currentPair]);

  // Pre-fetch images for nextPair
  useEffect(() => {
    Object.values(nextPair)
      .filter((id) => !fetchedImages.has(id))
      .forEach((id) => {
        new Image().src = getPokemonImage(id);
      });
  }, [nextPair]);

  // Category check
  useEffect(() => {
    if (session?.user) {
      // If a user is logged in, use their assigned category, if no category, generate one
      const userCategory = session.user.assignedCategory || getRandomCategory();

      setCategory(userCategory);
    } else if (!session) {
      refetchCategory();
    }
  }, [session]);

  function refetchCategory(): void {
    const randomizedCategory = getRandomCategory();
    if (randomizedCategory === category) return refetchCategory();

    setCategory(randomizedCategory);

    // Set Current Pokemon to prefetched Pokemon
    setCurrentPair(nextPair);

    // Refetch next pair
    setNextPair(getOptionsForVote());
  }

  // Vote Handler
  const voteMutation = trpc.useMutation(['poke.cast-vote']);

  const handleVote = (selected: number | undefined) => {
    if (!currentPair || !selected) return; // Early escape if pokemon could not be fetched

    if (selected === currentPair.firstId) {
      voteMutation.mutate({
        submittedById: session?.user?.id,
        category: category,
        votedFor: currentPair.firstId,
        votedAgainst: currentPair.secondId,
      });
    } else {
      voteMutation.mutate({
        submittedById: session?.user?.id,
        category: category,
        votedFor: currentPair.firstId,
        votedAgainst: currentPair.secondId,
      });
    }
    // Set Current Pokemon to prefetched Pokemon
    setCurrentPair(nextPair);

    // Refetch next pair
    setNextPair(getOptionsForVote());
  };

  /////////////////////////////
  // Begin HTML Rendering

  const isLoading = !currentPair || !mounted; // || voteMutation.isLoading;
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
          className="flex justify-evenly items-center w-full max-w-[620px] p-2"
          withBorder
          radius="lg"
        >
          <PokemonListing
            pokemonId={currentPair.firstId}
            vote={() => handleVote(currentPair.firstId)}
            disabled={isLoading}
          />
          <span>vs.</span>
          <PokemonListing
            pokemonId={currentPair.secondId}
            vote={() => handleVote(currentPair.secondId)}
            disabled={isLoading}
          />
        </Paper>
        {session ? (
          <p>&nbsp;</p>
        ) : (
          <p className="text-center">
            Don&apos;t like the category?{' '}
            <button
              className="cursor-pointer text-blue-400 hover:underline bg-transparent p-0 border-none"
              onClick={() => refetchCategory()}
            >
              Generate a new one
            </button>
          </p>
        )}
      </Container>
    </>
  );
};

export default VotePage;

// Pokemon Listing Component
interface PokemonListing {
  pokemonId: number;
  vote: () => void;
  disabled: boolean;
}

const PokemonListing = ({ pokemonId, vote, disabled }: PokemonListing) => {
  return (
    <div
      key={pokemonId}
      className={`flex flex-col justify-center items-center`}
    >
      <div
        className={`flex flex-col justify-center items-center transition-all ease-in-out duration-300 animate-fade-in
        ${disabled && 'animate-pulse'}`}
      >
        {/* Pokemon Name */}
        {disabled ? (
          <div className="w-40 h-5 bg-slate-700 rounded-lg my-[1.28rem]" />
        ) : (
          <h2 className="text-sm md:text-xl capitalize">
            {ALL_POKEMON[pokemonId - 1]}
          </h2>
        )}
        {/* Image */}
        {disabled ? (
          <div className="w-[192px] h-[192px]">
            <div className="h-[90%] bg-slate-700 rounded-lg transition-all" />
          </div>
        ) : (
          <>
            <MantineImage
              src={getPokemonImage(pokemonId)}
              alt={`${ALL_POKEMON[pokemonId - 1]}'s sprite image`}
              width={192}
              height={192}
              style={{ imageRendering: 'pixelated' }}
              //priority={true}
            />
          </>
        )}
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
