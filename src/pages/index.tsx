import { Button, Container, Group, Space } from '@mantine/core';
import { NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { FaDiscord, FaPencilAlt } from 'react-icons/fa';
import Typewriter from 'typewriter-effect';

const HomePage: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>PokeVote</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Open Graph Metadata */}
        <meta property="og:title" content="PokeVote" />
        <meta
          name="description"
          property="og:description"
          content="Settle debates on Pokemon characteristics through randomly generated 1v1 vote battles. Nothing more, nothing less. PokeVote will calculate totally unbiased and objective data points on the shape and character of the current 905 Pokemon."
        />
        <meta
          name="image"
          property="og:image"
          content="/preview-images/indexPreview.jpg"
        />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@elikeith404" />
        <meta name="twitter:title" content="PokeVote" />
        <meta
          name="twitter:description"
          content="Settle debates on Pokemon characteristics through randomly generated 1v1 vote battles. Nothing more, nothing less. PokeVote will calculate totally unbiased and objective data points on the shape and character of the current 905 Pokemon."
        />
        <meta
          name="twitter:image"
          content="https://poke-vote-elikeith404.vercel.app/preview-images/indexPreview.jpg"
        />
        <meta
          name="twitter:image:alt"
          content="Homepage of PokeVote, rotating through the vote categories"
        />
      </Head>
      <Container className="flex flex-col justify-center items-center h-full">
        <h1
          className="text-3xl md:text-4xl text-center"
          style={{ color: 'li' }}
        >
          Vote on which Pokemon is the{' '}
          <Typewriter
            options={{
              strings: [
                '<span style="color: cyan;">Roundest</span>',
                '<span style="color: yellow;">Sharpest</span>',
                '<span style="color: red;">Meanest</span>',
                '<span style="color: pink;">Friendliest</span>',
                '<span style="color: orange;">Wackiest</span>',
                '<span style="color: lightsalmon;">Tastiest</span>',
                '<span style="color: lightgreen;">Rowdiest</span>',
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </h1>
        <p className="text-center">
          Settle debates on Pokemon characteristics through randomly generated
          1v1 vote battles. Nothing more, nothing less. PokeVote will calculate
          totally unbiased and objective data points on the shape and character
          of the current 905 Pokemon.
        </p>
        <Space py={5} />
        <Group className="justify-center">
          <Link href="/vote" passHref>
            <Button
              className="bg-blue-800 hover:bg-blue-900"
              radius={'md'}
              component={'a'}
            >
              <FaPencilAlt className="mr-2" />
              <span>Vote Now!</span>
            </Button>
          </Link>
          {/* !session ? (
            <Button
              className="bg-blue-800 hover:bg-blue-900"
              radius={'md'}
              onClick={() => signIn('discord')}
            >
              <FaDiscord size={18} className={'mr-2'} />{' '}
              <span>Sign In To Vote</span>
            </Button>
          ) : (
            <Link href="/vote" passHref>
              <Button
                className="bg-blue-800 hover:bg-blue-900"
                radius={'md'}
                component={'a'}
              >
                <FaPencilAlt className="mr-2" />
                <span>Go To Vote</span>
              </Button>
            </Link>
          ) */}
          <Link href={'/results'} passHref>
            <Button
              className="bg-orange-700 hover:bg-orange-800"
              radius={'md'}
              component={'a'}
            >
              See Results
            </Button>
          </Link>
        </Group>
        <Space pt={20} />
      </Container>
    </>
  );
};

export default HomePage;
