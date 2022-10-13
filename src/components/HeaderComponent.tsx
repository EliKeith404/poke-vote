import {
  Anchor,
  Avatar,
  Burger,
  Button,
  Container,
  Group,
  Header,
  MediaQuery,
  Menu,
  Text,
} from '@mantine/core';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { GoPerson, GoGear, GoSignOut } from 'react-icons/go';
import { FaDiscord } from 'react-icons/fa';

const HeaderComponent = ({
  opened,
  toggle,
}: {
  opened: boolean;
  toggle: () => void;
}) => {
  const { data: session } = useSession();

  return (
    <>
      <Header height={75}>
        <Container className="flex justify-between items-center h-full">
          <Group className="flex items-center">
            <Link href={'/'} passHref>
              <Anchor
                className="font-pokemon tracking-wider text-2xl text-white hover:no-underline pr-4"
                component="a"
              >
                PokeVote
              </Anchor>
            </Link>
            <Text className="hidden md:block">|</Text>
            <nav className="hidden md:flex justify-evenly ">
              <Link href={'/'} passHref>
                <Anchor
                  className="tracking-wider text-white py-7 px-4"
                  component="a"
                >
                  Home
                </Anchor>
              </Link>
              <Link href={'/results'} passHref>
                <Anchor
                  className="tracking-wider text-white py-7 px-4"
                  component="a"
                >
                  Results
                </Anchor>
              </Link>
              <Link href={'/about'} passHref>
                <Anchor
                  className="tracking-wider text-white py-7 px-4"
                  component="a"
                >
                  About
                </Anchor>
              </Link>
            </nav>
          </Group>
          <Group className="flex justify-between items-center">
            {!session ? (
              // If the user doesn't have an active session, display login button,
              <Button
                className="hidden xs:flex justify-center items-center font-bold bg-blue-800 hover:bg-blue-900"
                radius={'md'}
                onClick={() => signIn('discord')}
              >
                <FaDiscord className="mr-2 mt-[.1rem]" size={20} />
                Sign In
              </Button>
            ) : (
              // Else display user info and logout button
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Avatar
                    className="cursor-pointer"
                    src={session.user?.image}
                    alt={`${session.user?.name}'s Profile Image`}
                    radius="md"
                  />
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>{`Welcome, ${session.user?.name}`}</Menu.Label>
                  <Menu.Item icon={<GoPerson size={14} />}>Profile</Menu.Item>
                  <Menu.Item icon={<GoGear size={14} />}>Settings</Menu.Item>
                  <Menu.Item
                    color={'red'}
                    icon={<GoSignOut size={14} />}
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => toggle()}
                size="sm"
                ml={10}
              />
            </MediaQuery>
          </Group>
        </Container>
      </Header>
    </>
  );
};

export default HeaderComponent;
