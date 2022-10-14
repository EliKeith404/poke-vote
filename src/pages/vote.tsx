import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type React from 'react';
import { inferQueryOutput, trpc } from '../utils/trpc';
import { Anchor, Button, Container, Paper, Space, Text } from '@mantine/core';
import { signIn, useSession } from 'next-auth/react';

const VoteHeader = () => {
  return (
    <Head>
      <title>Voting | PokeVote</title>
      <meta property="og:title" content="Voting | PokeVote" />
      <meta name="description" content="1v1 Vote on Roundest Pokemon" />
      <meta name="image" property="og:image" content="/assets/preview.png" />
    </Head>
  );
};

const VotePage: NextPage = () => {
  const [mounted, isMounted] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    isMounted(true);
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
        votedFor: pokemon.first,
        votedAgainst: pokemon.second,
      });
    } else {
      voteMutation.mutate({
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
  /*
  if (status === 'unauthenticated') {
    return (
      <>
        <VoteHeader />
        <Container>
          <h1>Access Denied</h1>
          <Text>
            Please <Anchor onClick={() => signIn('discord')}>sign in</Anchor> to
            vote on categories!
          </Text>
        </Container>
      </>
    );
  }
  */

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
        <h1 className="text-xl text-center">{`Which Pokemon is Rounder?`}</h1>
        <Space h={25} />
        <Paper
          className="flex justify-evenly items-center w-full max-w-[620px] p-2 animate-fade-in"
          withBorder
          radius="lg"
        >
          {mounted && (
            <PokemonListing
              pokemon={pokemon.first}
              vote={() => handleVote(pokemon.first.id)}
              disabled={fetchingNext}
            />
          )}
          <span>vs.</span>
          {mounted && (
            <PokemonListing
              pokemon={pokemon.second}
              vote={() => handleVote(pokemon.second.id)}
              disabled={fetchingNext}
            />
          )}
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
            src={pokemon.spriteUrl}
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
