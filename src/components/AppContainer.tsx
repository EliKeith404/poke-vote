import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import HeaderComponent from './HeaderComponent';
import NavComponent from './NavComponent';

const AppContainer = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <AppShell
      fixed
      navbarOffsetBreakpoint="sm"
      header={<HeaderComponent opened={opened} toggle={toggle} />}
      navbar={<NavComponent opened={opened} close={close} />}
      // footer={<Footer height={60}>Footer</Footer>}
    >
      {children}
    </AppShell>
  );
};

export default AppContainer;
