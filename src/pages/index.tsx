import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type React from 'react';
import { inferQueryOutput, trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const [mounted, isMounted] = useState(false);

  useEffect(() => {
    isMounted(true);
  }, []);

  const {
    data: pokemon,
    refetch,
    isLoading,
  } = trpc.useQuery(['poke.get-pokemon-pair'], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const voteMutation = trpc.useMutation(['poke.cast-vote']);

  const voteForRoundest = (selected: number | undefined) => {
    if (!pokemon?.first || !pokemon?.second || !selected) return;

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

  return (
    <>
      <Head>
        <title>PokeVote</title>
        <meta property="og:title" content="PokeVote" />
        <meta name="description" content="1v1 Vote on Roundest Pokemon" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-screen w-screen flex flex-col justify-center items-center">
        <div>
          <p>Which Pokemon is rounder?</p>
        </div>
        <div className="p-4" />
        <div className="flex justify-between items-center border w-full max-w-[620px] p-6">
          {mounted && (
            <PokemonListing
              pokemon={pokemon.first}
              vote={() => voteForRoundest(pokemon.first?.id)}
            />
          )}
          <div>
            <span>vs.</span>
          </div>
          {mounted && (
            <PokemonListing
              pokemon={pokemon.second}
              vote={() => voteForRoundest(pokemon.second?.id)}
            />
          )}
        </div>
      </main>
    </>
  );
};

export default Home;

type ServerType = inferQueryOutput<'poke.get-pokemon-pair'>['first'];

const PokemonListing: React.FC<{
  pokemon: ServerType;
  vote: () => void;
}> = ({ pokemon, vote }) => {
  return (
    <div className="w-64 h-64 flex flex-col justify-center items-center bg-red-800">
      <h2 className="text-xl capitalize">{pokemon?.name}</h2>
      <div className="m-[-1rem]">
        <Image
          src={pokemon?.spriteUrl || ''}
          alt={`${pokemon?.name}'s sprite image`}
          width={192}
          height={192}
        />
      </div>
      <button
        className="py-1 px-4 rounded-xl shadow-xl bg-slate-400 z-10"
        onClick={() => vote()}
      >
        Vote
      </button>
    </div>
  );
};
