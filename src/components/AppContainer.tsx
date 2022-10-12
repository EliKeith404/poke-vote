import { AppShell } from '@mantine/core';
import { useClickOutside, useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react';
import HeaderComponent from './HeaderComponent';
import NavComponent from './NavComponent';

const AppContainer = (props: {
  children:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
}) => {
  const [nav, setNav] = useState(false);
  const [opened, { toggle, close }] = useDisclosure(false);
  const clickOutsideRef = useClickOutside(() => close());

  return (
    <AppShell
      fixed
      navbarOffsetBreakpoint="sm"
      header={<HeaderComponent opened={opened} toggle={toggle} close={close} />}
      navbar={<NavComponent opened={opened} toggle={toggle} close={close} />}
      // footer={<Footer height={60}>Footer</Footer>}
    >
      {props.children}
    </AppShell>
  );
};

export default AppContainer;
