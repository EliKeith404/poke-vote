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
        <title>Home | PokeVote</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="1v1 Vote on Roundest Pokemon" />
        {/* Open Graph Metadata */}
        <meta property="og:title" content="PokeVote Home Page" />
        <meta
          property="og:description"
          content="1v1 Vote on Roundest Pokemon"
        />
        <meta property="og:image" content="/assets/preview.png" />
      </Head>
      <Container className="flex flex-col justify-center items-center h-full">
        <h1 className="text-3xl md:text-4xl text-center">
          Vote on which Pokemon is the{' '}
          <Typewriter
            options={{
              strings: [
                '<span style="color: cyan;">Roundest</span>',
                '<span style="color: yellow;">Sharpest</span>',
                '<span style="color: red;">Meanest</span>',
                '<span style="color: pink;">Friendliest</span>',
                '<span style="color: orange;">Wackiest</span>',
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
              <span>Go To Vote</span>
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
