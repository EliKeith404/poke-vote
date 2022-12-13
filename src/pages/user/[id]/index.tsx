import { Container } from '@mantine/core';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { prisma } from '../../../server/db/client';
import type { IUserProps } from '../../../types/user';
import UserCard from '../../../components/profile/UserCard';
import UserStats from '../../../components/profile/UserStats';

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  const paths = res.map((item) => {
    return {
      params: { id: item.id },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: ctx.params?.id as string,
    },
    select: {
      id: true,
      name: true,
      image: true,
      assignedCategory: true,
    },
  });

  if (!userData) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: userData,
    },
    revalidate: 5,
  };
};

const ProfilePage: NextPage<IUserProps> = ({ user }) => {
  const { data: session } = useSession();
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    session?.user?.id === user.id
      ? setIsOwnProfile(true)
      : setIsOwnProfile(false);
  }, [session?.user, user]);

  return (
    <Container className="grid grid-cols-6 gap-5">
      <div className="col-span-2">
        <UserCard user={user} owned={isOwnProfile} />
      </div>
      <main className="col-span-4">
        <UserStats user={user} />
      </main>
    </Container>
  );
};

export default ProfilePage;
