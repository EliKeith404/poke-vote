import { Anchor, Navbar, Paper, Transition } from '@mantine/core';
import Link from 'next/link';
import React from 'react';

const NavComponent = ({
  opened,
  toggle,
  close,
}: {
  opened: boolean;
  toggle: () => void;
  close: () => void;
}) => {
  const scaleY = {
    in: { opacity: 1, transform: 'scaleY(1)' },
    out: { opacity: 0, transform: 'scaleY(0)' },
    common: { transformOrigin: 'top' },
    transitionProperty: 'transform, opacity',
  };

  return (
    <>
      <Transition
        mounted={opened}
        transition={scaleY}
        duration={200}
        timingFunction="ease"
      >
        {(styles) => (
          <Navbar
            style={styles}
            className={'bg-black/90'}
            width={{ base: '100%', sm: 0 }}
            height="100%"
            hidden={!opened}
            onClick={() => close()}
          >
            <Paper className="bg-zinc-800" shadow={'lg'}>
              <Link href={'/'} passHref>
                <Anchor
                  className="block px-3 py-7 text-lg hover:bg-zinc-700"
                  component="a"
                >
                  Home
                </Anchor>
              </Link>
              <Link href={'/results'} passHref>
                <Anchor
                  className="block px-3 py-7 text-lg hover:bg-zinc-700"
                  component="a"
                >
                  Results
                </Anchor>
              </Link>
            </Paper>
          </Navbar>
        )}
      </Transition>
    </>
  );
};

export default NavComponent;
