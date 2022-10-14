import { Anchor, Navbar, Paper, Transition } from '@mantine/core';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import {
  FaDiscord,
  FaHome,
  FaPencilAlt,
  FaPoll,
  FaQuestionCircle,
} from 'react-icons/fa';
import { GoSignOut } from 'react-icons/go';

const NavComponent = ({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) => {
  const { data: session } = useSession();
  const scaleY = {
    in: { opacity: 1, transform: 'scaleY(1)' },
    out: { opacity: 0, transform: 'scaleY(0)' },
    common: { transformOrigin: 'top' },
    transitionProperty: 'transform, opacity',
  };

  return (
    <>
      <Navbar
        className={'bg-black/90'}
        width={{ base: '100%', sm: 0 }}
        height="100%"
        hidden={!opened}
        onClick={() => close()}
      >
        <Transition
          mounted={opened}
          transition={scaleY}
          duration={200}
          timingFunction="ease"
        >
          {(styles) => (
            <Paper className="bg-zinc-800" style={styles} shadow={'lg'}>
              <Link href={'/'} passHref>
                <Anchor
                  className="flex items-center px-3 py-7 text-lg hover:bg-zinc-700"
                  component="a"
                >
                  <FaHome size={18} className="mr-2" />
                  <span>Home</span>
                </Anchor>
              </Link>
              <Link href={'/vote'} passHref>
                <Anchor
                  className="flex items-center px-3 py-7 text-lg hover:bg-zinc-700"
                  component="a"
                >
                  <FaPencilAlt size={18} className="mr-2" />
                  <span>Vote</span>
                </Anchor>
              </Link>
              <Link href={'/results'} passHref>
                <Anchor
                  className="flex items-center px-3 py-7 text-lg hover:bg-zinc-700"
                  component="a"
                >
                  <FaPoll size={18} className="mr-2" />
                  <span>Results</span>
                </Anchor>
              </Link>
              <Link href={'/about'} passHref>
                <Anchor
                  className="flex items-center px-3 py-7 text-lg hover:bg-zinc-700"
                  component="a"
                >
                  <FaQuestionCircle size={18} className="mr-2" />
                  <span>About</span>
                </Anchor>
              </Link>

              {!session ? (
                <Anchor
                  className="xs:hidden flex items-center px-3 py-7 text-lg hover:bg-zinc-700"
                  component="text"
                  onClick={() => signIn('discord')}
                >
                  <FaDiscord size={18} className="mr-2" />
                  <span>Sign In</span>
                </Anchor>
              ) : (
                <Anchor
                  className="xs:hidden flex items-center px-3 py-7 text-lg text-red-600 hover:bg-red-900/20"
                  component="text"
                  onClick={() => signOut()}
                >
                  <GoSignOut size={18} className="mr-2" />
                  <span>Sign Out</span>
                </Anchor>
              )}
            </Paper>
          )}
        </Transition>
      </Navbar>
    </>
  );
};

export default NavComponent;
