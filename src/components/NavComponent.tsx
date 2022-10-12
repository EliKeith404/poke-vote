import { Anchor, Button, Navbar, Paper, Transition } from '@mantine/core';
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
            className={'bg-slate-800'}
            width={{ base: '100%', sm: 0 }}
            height="0"
            hidden={!opened}
          >
            <Paper className="bg-slate-900" shadow={'lg'}>
              <Link href={'/'} passHref>
                <Anchor
                  className="block px-3 py-7 hover:bg-slate-800"
                  component="a"
                  onClick={() => close()}
                >
                  Home
                </Anchor>
              </Link>
              <Link href={'/results'} passHref>
                <Anchor
                  className="block px-3 py-7 hover:bg-slate-800"
                  component="a"
                  onClick={() => close()}
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
