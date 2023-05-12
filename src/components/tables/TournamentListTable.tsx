import { Button } from '@mantine/core';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { inferQueryOutput, trpc } from '../../utils/trpc';

type TournamentList = {
  tournaments: inferQueryOutput<'tournament.get-all'>;
  active: boolean;
  callback: () => void;
};

const TournamentListTable = ({
  tournaments,
  active,
  callback,
}: TournamentList) => {
  const { data: session } = useSession();
  const registerMutation = trpc.useMutation(['tournament.add-participant']);
  const unregisterMutation = trpc.useMutation([
    'tournament.remove-participant',
  ]);
  const assignCategory = trpc.useMutation(['user.assign-category']);
  const removeCategory = trpc.useMutation(['user.remove-category']);

  useEffect(() => {
    if (registerMutation.isSuccess || unregisterMutation.isSuccess) {
      setTimeout(() => {
        callback();
      }, 500);
    }
  }, [registerMutation.isSuccess, unregisterMutation.isSuccess]); //eslint-disable-line

  const handleRegistration = (
    tournamentId: string,
    addParticipant: boolean
  ) => {
    if (!session?.user) return;

    if (addParticipant) {
      registerMutation.mutate({
        tournamentId: tournamentId,
        userId: session?.user?.id,
      });
      assignCategory.mutate({
        userId: session?.user?.id,
      });
    } else {
      unregisterMutation.mutate({
        tournamentId: tournamentId,
        userId: session?.user?.id,
      });
      removeCategory.mutate({
        userIds: [session.user.id],
      });
    }
  };

  return (
    <div className="grid">
      <div className="grid grid-cols-5 font-bold mb-3">
        <span className="col-span-2">Tournament Name</span>
        <span>Participants</span>
        <span>Winner</span>
        <span>Action</span>
      </div>
      {tournaments &&
        session?.user &&
        tournaments
          .filter((tourney) => tourney.active === active)
          .map((tourney, i) => (
            <div
              className="grid grid-cols-5 items-center p-2 border-gray-700 border border-solid"
              key={i}
            >
              <span className="col-span-2">{tourney.name}</span>
              <span>{tourney.participants.length}</span>
              <Link href={`/user/${tourney.winner?.id}`} passHref>
                <a>{tourney.winner?.name}</a>
              </Link>
              {active ? (
                tourney.participants.some(
                  (user) => user.id === session.user?.id
                ) ? (
                  <Button onClick={() => handleRegistration(tourney.id, false)}>
                    Unregister
                  </Button>
                ) : (
                  <Button onClick={() => handleRegistration(tourney.id, true)}>
                    Register
                  </Button>
                )
              ) : (
                <Button>View Bracket</Button>
              )}
            </div>
          ))}
    </div>
  );
};

export default TournamentListTable;
