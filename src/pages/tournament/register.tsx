import { Button } from '@mantine/core';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import TournamentListTable from '../../components/tables/TournamentListTable';
import { trpc } from '../../utils/trpc';

const RegisterPage: NextPage = () => {
  const allTournaments = trpc.useQuery(['tournament.get-all']);

  return (
    <div>
      <p>Current Tournaments</p>
      {allTournaments.data && (
        <TournamentListTable
          tournaments={allTournaments.data}
          active={true}
          callback={allTournaments.refetch}
        />
      )}

      <p>Previous Tournaments</p>
      {allTournaments.data && (
        <TournamentListTable
          tournaments={allTournaments.data}
          active={false}
          callback={allTournaments.refetch}
        />
      )}
    </div>
  );
};

export default RegisterPage;
