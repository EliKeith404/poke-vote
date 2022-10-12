import {
  Anchor,
  Avatar,
  Burger,
  Button,
  Container,
  Grid,
  Group,
  Header,
  MediaQuery,
  Menu,
  Text,
} from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { GoPerson, GoGear, GoSignOut } from 'react-icons/go';

const HeaderComponent = ({
  opened,
  toggle,
  close,
}: {
  opened: boolean;
  toggle: () => void;
  close: () => void;
}) => {
  const { data: session } = useSession();

  return (
    <Header height={75} p="md">
      <Container className="flex justify-between items-center h-full">
        <Group className="flex items-center">
          <Link href={'/'} passHref>
            <Anchor
              className="font-pokemon tracking-wider mt-[-0.6rem] text-2xl text-white hover:no-underline"
              component="a"
            >
              PokeVote
            </Anchor>
          </Link>
          <Text className="hidden md:block px-5">|</Text>
          <Link href={'/'} passHref>
            <Anchor className="hidden md:block py-7" component="a">
              Home
            </Anchor>
          </Link>
          <Link href={'/results'} passHref>
            <Anchor className="hidden md:block px-3 py-7" component="a">
              Results
            </Anchor>
          </Link>
        </Group>
        <Group className="flex justify-between items-center">
          {!session ? (
            // If the user doesn't have an active session, display login button,
            <Button
              className="border py-2 px-4 rounded-xl font-bold bg-blue-900 hover:bg-blue-800"
              onClick={() => signIn('discord')}
            >
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
              ml={20}
            />
          </MediaQuery>
        </Group>
      </Container>
    </Header>
  );
};

export default HeaderComponent;
