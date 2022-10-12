import Link from 'next/link';
import React, { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import {
  Anchor,
  Avatar,
  Burger,
  Button,
  Grid,
  Header,
  MediaQuery,
  Menu,
  Navbar,
  Text,
} from '@mantine/core';
import { GoPerson, GoGear, GoSignOut } from 'react-icons/go';

const Nav = () => {
  const { data: session } = useSession();
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav((prev) => !prev);
  };

  return (
    <>
      <Header height={75} fixed>
        <Grid>
          <Grid.Col span={4}>
            <Link href={'/'}>
              <Anchor
                className="font-pokemon tracking-wider px-5 mt-[-0.6rem] text-2xl text-white hover:no-underline"
                component="a"
              >
                PokeVote
              </Anchor>
            </Link>
          </Grid.Col>
          <Grid.Col span={4}>
            <Navbar p={'md'} hiddenBreakpoint={'sm'} hidden={!nav}>
              <Text>Hello</Text>
            </Navbar>
          </Grid.Col>
          <Grid.Col span={4}>
            <Grid>
              <Grid.Col span={1}>
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
                        className="grid"
                        src={session.user?.image}
                        alt={`${session.user?.name}'s Profile Image`}
                        radius="md"
                      />
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Label>{`Welcome, ${session.user?.name}`}</Menu.Label>
                      <Menu.Item icon={<GoPerson size={14} />}>
                        Profile
                      </Menu.Item>
                      <Menu.Item icon={<GoGear size={14} />}>
                        Settings
                      </Menu.Item>
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
              </Grid.Col>
              <Grid.Col span={1}>
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                  <Burger
                    opened={nav}
                    onClick={() => setNav((prev) => !prev)}
                    size="sm"
                    ml="xl"
                  />
                </MediaQuery>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
      </Header>
      <header className="fixed flex justify-between items-center h-20 w-full bg-slate-700 shadow-xl">
        <div className="flex justify-start items-center h-full">
          <Link href={'/'} passHref>
            <Anchor
              className="font-pokemon tracking-wider px-5 mt-[-0.6rem] text-2xl text-white hover:no-underline"
              component="a"
            >
              PokeVote
            </Anchor>
          </Link>
          <span className="hidden md:block text-3xl opacity-10 mt-[-0.5rem] -z-10">
            |
          </span>
          <ul className="hidden md:flex justify-center items-center font-bold">
            <li className="">
              <Link href={'/'} passHref>
                <Anchor className="px-5 py-7" component="a">
                  Home
                </Anchor>
              </Link>
            </li>
            <li className="">
              <Link href={'/results'} passHref>
                <Anchor className="px-3 py-7" component="a">
                  Results
                </Anchor>
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center px-5">
          {!session ? (
            // If the user doesn't have an active session, display login button,
            <button
              className="border py-2 px-4 rounded-xl font-bold bg-blue-900 hover:bg-blue-800"
              onClick={() => signIn('discord')}
            >
              Sign In
            </button>
          ) : (
            // Else display user info and logout button
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Avatar
                  className="grid"
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
          <button className="md:hidden pl-5 text-3xl" onClick={handleNav}>
            =
          </button>
        </div>
      </header>

      {/* Spacer Element For Navbar -> Content */}
      <div className="py-10" />
    </>
  );
};

export default Nav;
