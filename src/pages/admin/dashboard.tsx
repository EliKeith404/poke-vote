import { Container, Text } from '@mantine/core';
import { Role } from '@prisma/client';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const AdminDashboard: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Reroute user to unauth page if lacking permissions
  useEffect(() => {
    if (status !== 'loading') {
      if (!session) router.push('/unauthorized');
      else if (session?.user?.role !== Role.ADMIN) router.push('/forbidden');
    }
  }, [session, status, router]);

  // Loading State
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // HTML Rendering
  return (
    <Container>
      <Text component="h1">Admin Panel</Text>
    </Container>
  );
};

export default AdminDashboard;
