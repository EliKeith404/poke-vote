import { Anchor, Container } from '@mantine/core';
import { NextPage } from 'next';
import { signIn } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import { getPokemonImage } from '../utils/getPokemonImage';

const ForbiddenPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Forbidden | PokeVote</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Open Graph Metadata */}
        <meta name="title" property="og:title" content="Forbidden | PokeVote" />
        <meta
          name="description"
          property="og:description"
          content="Please sign in to view the contents of this page."
        />
        <meta
          name="image"
          property="og:image"
          content="/preview-images/404Preview.jpg"
        />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@elikeith404" />
        <meta name="twitter:title" content="Forbidden | PokeVote" />
        <meta
          name="twitter:description"
          content="Please sign in to view the contents of this page."
        />
        <meta
          name="twitter:image"
          content="https://poke-vote-elikeith404.vercel.app/preview-images/404Preview.jpg"
        />
        <meta
          name="twitter:image:alt"
          content="Forbidden page access, presented by pokemon #403, Shinx"
        />
      </Head>
      <Container className="flex flex-col justify-center items-center max-w-2xl h-full">
        <h1 className="text-3xl md:text-4xl text-center">403: Forbidden</h1>
        <div className="-my-12 -z-10">
          <Image
            style={{ imageRendering: 'pixelated' }}
            src={getPokemonImage(403)}
            alt={'Pokemon #403, Shinx'}
            title={'Pokemon #403, Shinx'}
            width={250}
            height={250}
          />
        </div>
        <p className="text-center">
          You do not have enough credentials to view this page. Please{' '}
          <Anchor onClick={() => signIn('discord')} component={'button'}>
            sign in
          </Anchor>{' '}
          to an account with higher privileges to view this page!
        </p>
      </Container>
    </>
  );
};

export default ForbiddenPage;
