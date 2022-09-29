import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type React from 'react';
import { inferQueryOutput, trpc } from '../utils/trpc';

const Home: NextPage = (props) => {
  const [mounted, isMounted] = useState(false);

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

  if (isLoading || !pokemon) {
    return <div>Loading...</div>;
  }

  const fetchingNext = voteMutation.isLoading || isLoading;

  return (
    <>
      <Head>
        <title>PokeVote</title>
        <meta property="og:title" content="PokeVote" />
        <meta name="description" content="1v1 Vote on Roundest Pokemon" />
        <meta name="image" property="og:image" content="/assets/preview.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-screen w-screen flex flex-col justify-center items-center">
        <div>
          <p>Which Pokemon is Rounder?</p>
        </div>
        <div className="p-4" />
        <div className="flex justify-between items-center border rounded-xl w-full max-w-[620px] p-6 animate-fade-in">
          {mounted && (
            <PokemonListing
              pokemon={pokemon.first}
              vote={() => handleVote(pokemon.first.id)}
              disabled={fetchingNext}
            />
          )}
          <div>
            <span>vs.</span>
          </div>
          {mounted && (
            <PokemonListing
              pokemon={pokemon.second}
              vote={() => handleVote(pokemon.second.id)}
              disabled={fetchingNext}
            />
          )}
        </div>
      </main>
    </>
  );
};

export default Home;

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
    <div className={`w-64 h-64 flex flex-col justify-center items-center`}>
      <div
        className={`flex flex-col justify-center items-center transition-opacity ${
          disabled && 'opacity-0'
        }`}
      >
        <h2 className="text-xl capitalize">{pokemon.name}</h2>
        <div className="m-[-1rem] animate-fade-in">
          <Image
            src={pokemon.spriteUrl}
            alt={`${pokemon.name}'s sprite image`}
            width={192}
            height={192}
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      </div>
      <button
        className={`py-1 px-4 rounded-xl shadow-xl bg-slate-400 z-10`}
        onClick={() => vote()}
        disabled={disabled}
      >
        Vote
      </button>
    </div>
  );
};
