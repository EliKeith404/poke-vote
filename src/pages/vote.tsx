import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type React from 'react';
import { inferQueryOutput, trpc } from '../utils/trpc';
import { Button, Container, Paper, Space } from '@mantine/core';
import { useSession } from 'next-auth/react';

import { Category } from '@prisma/client';
import getRandomCategory from '../utils/getRandomCategory';

// Pokemon Server Output Types
type PokemonPairType = inferQueryOutput<'poke.get-pokemon-pair'>;
type PokemonType = inferQueryOutput<'poke.get-pokemon-pair'>['first'];

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
  const [pokemonPair, setPokemonPair] = useState<PokemonPairType | null>(null);
  const [fetchNextPokemonPair, setFetchNextPokemonPair] = useState(true);
  const [pokemonPairLoading, setPokemonPairLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();

  // Grab 2 Pokemon from database
  const { data: nextPokemonPair, refetch } = trpc.useQuery(
    ['poke.get-pokemon-pair'],
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    const transferPokemonPair = (): void => {
      if (nextPokemonPair) {
        setTimeout(() => {
          setPokemonPair(nextPokemonPair);
          refetch();
          setFetchNextPokemonPair(false);
          setPokemonPairLoading(false);
        }, 300);
      }
    };

    if (session?.user) {
      // If a user is logged in, use their assigned category, if no category, generate one
      const userCategory = session.user.assignedCategory || getRandomCategory();

      setCategory(userCategory);
    } else if (!session && !mounted) {
      refetchCategory();
    }

    // If a request to load another pair comes in, set the preloaded pokemon as current and refetch
    if (fetchNextPokemonPair && nextPokemonPair) {
      transferPokemonPair();
    }

    // When the pokemon pair is loaded, stop displaying loading state
    if (pokemonPair) {
      setPokemonPairLoading(false);
    } else {
      setPokemonPairLoading(true);
    }

    setMounted(true);
  }, [session, pokemonPair, nextPokemonPair, mounted, fetchNextPokemonPair]);

  function refetchCategory(): void {
    const randomizedCategory = getRandomCategory();
    if (randomizedCategory === category) return refetchCategory();

    setCategory(randomizedCategory);
    setFetchNextPokemonPair(true);
  }

  // Vote Handler
  const voteMutation = trpc.useMutation(['poke.cast-vote']);

  const handleVote = (selected: number | undefined) => {
    if (!pokemonPair || !selected) return; // Early escape if pokemon could not be fetched

    if (selected === pokemonPair.first.id) {
      voteMutation.mutate({
        submittedById: session?.user?.id,
        category: category,
        votedFor: pokemonPair.first,
        votedAgainst: pokemonPair.second,
      });
    } else {
      voteMutation.mutate({
        submittedById: session?.user?.id,
        category: category,
        votedFor: pokemonPair.second,
        votedAgainst: pokemonPair.first,
      });
    }

    setFetchNextPokemonPair(true);
  };

  /////////////////////////////
  // Begin HTML Rendering

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
            pokemon={pokemonPair?.first}
            vote={() => handleVote(pokemonPair?.first.id)}
            disabled={pokemonPairLoading}
            loadingNext={fetchNextPokemonPair}
          />
          <span>vs.</span>
          <PokemonListing
            pokemon={pokemonPair?.second}
            vote={() => handleVote(pokemonPair?.second.id)}
            disabled={pokemonPairLoading}
            loadingNext={fetchNextPokemonPair}
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
  pokemon: PokemonType | undefined;
  vote: () => void;
  disabled: boolean;
  loadingNext: boolean;
}

const PokemonListing = ({
  pokemon,
  vote,
  disabled,
  loadingNext,
}: PokemonListing) => {
  return (
    <div className={`flex flex-col justify-center items-center`}>
      <div
        className={`flex flex-col justify-center items-center transition-all ease-in-out duration-300 
        ${loadingNext ? 'opacity-0' : 'opacity-100'} 
        ${disabled && 'animate-pulse'}`}
      >
        {/* Header */}
        {disabled ? (
          <div className="w-40 h-5 bg-slate-700 rounded-lg my-[1.28rem]" />
        ) : (
          <h2 className="text-sm md:text-xl capitalize">{pokemon?.name}</h2>
        )}
        {/* Image */}
        {disabled ? (
          <div className="w-[192px] h-[192px]">
            <div className="h-[90%] bg-slate-700 rounded-lg transition-all" />
          </div>
        ) : (
          <Image
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon?.id}.png`}
            alt={`${pokemon?.name}'s sprite image`}
            width={192}
            height={192}
            style={{ imageRendering: 'pixelated' }}
            className={``}
            priority
          />
        )}
      </div>

      <Button
        className="mb-2"
        color="yellow"
        radius="md"
        onClick={() => vote()}
        disabled={loadingNext || disabled}
      >
        Vote
      </Button>
    </div>
  );
};
