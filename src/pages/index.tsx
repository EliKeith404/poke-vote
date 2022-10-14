import { Button, Container, Group, Space } from '@mantine/core';
import { NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { FaDiscord, FaPencilAlt } from 'react-icons/fa';
import Typewriter from 'typewriter-effect';

const HomePage: NextPage = () => {
  const { data: session } = useSession();

  return (
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
        Settle debates on Pokemon characteristics through randomly generated 1v1
        vote battles. Nothing more, nothing less.
      </p>
      <Group className="justify-center">
        {!session ? (
          <Button
            className="bg-blue-800 hover:bg-blue-900"
            radius={'md'}
            onClick={() => signIn('discord')}
          >
            <FaDiscord size={18} className={'mr-2'} /> Sign In To Vote
          </Button>
        ) : (
          <Link href="/vote" passHref>
            <Button
              className="bg-blue-800 hover:bg-blue-900"
              radius={'md'}
              component={'a'}
            >
              <FaPencilAlt className="mr-2" /> Go To Vote
            </Button>
          </Link>
        )}
        <Link href={'/results'} passHref>
          <Button color={'yellow'} radius={'md'} component={'a'}>
            See Results
          </Button>
        </Link>
      </Group>
      <Space py={50} />
    </Container>
  );
};

export default HomePage;
