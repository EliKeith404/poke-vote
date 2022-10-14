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
        <meta property="og:title" content="PokeVote Home Page" />
        <meta name="description" content="1v1 Vote on Roundest Pokemon" />
        <meta name="image" property="og:image" content="/assets/preview.png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Container className="flex flex-col justify-center items-center h-full">
        <h1 className="text-3xl md:text-4xl text-center">
          Vote on your favorite{' '}
          <Typewriter
            options={{
              strings: [
                '<span style="color: cyan;">Round</span>',
                '<span style="color: yellow;">Sharp</span>',
                '<span style="color: red;">Mean</span>',
                '<span style="color: pink;">Friendly</span>',
              ],
              autoStart: true,
              loop: true,
            }}
          />{' '}
          Pokemon
        </h1>
        <p className="text-center">
          Settle debates on Pokemon characteristics through randomly generated
          1v1 vote battles. Nothing more, nothing less. PokeVote will calculate
          totally unbiased, objective data points on the shape and character of
          the current 905 Pokemon.
        </p>
        <Space py={5} />
        <Group className="justify-center">
          {!session ? (
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
          )}
          <Link href={'/results'} passHref>
            <Button className="bg-orange-700" radius={'md'} component={'a'}>
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
