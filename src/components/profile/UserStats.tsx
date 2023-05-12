import React from 'react';
import { IUser } from '../../types/user';
import { trpc } from '../../utils/trpc';

const UserStats = ({ user }: { user: IUser }) => {
  const userStats = trpc.useQuery(['user.get-stats', { id: user?.id }]);

  return (
    <div className="flex flex-col justify-center bg-gray-700 rounded-xl p-5">
      <h1 className="text-xl m-auto">{`${user?.name ?? 'User'}'s Stats`}</h1>
      <div className="grid grid-flow-row gap-1 py-3">
        <span className="font-semibold">
          Assigned Category:{' '}
          <span className="font-normal capitalize">
            {user?.assignedCategory ?? 'none'}
          </span>
        </span>
        <span className="font-semibold">
          Total Votes:{' '}
          <span className="font-normal">{userStats.data?.votes ?? 0}</span>
        </span>
        <span className="font-semibold">
          Tournaments Entered:{' '}
          <span className="font-normal">
            {userStats.data?.tournaments.length ?? 0}
          </span>
        </span>
        <span className="font-semibold">
          Tournaments Won:{' '}
          <span className="font-normal">
            {userStats.data?.tournaments.reduce(
              (acc, c) => acc + (c.winnerId === user?.id ? 1 : 0),
              0
            ) ?? 0}
          </span>
        </span>
      </div>
    </div>
  );
};

export default UserStats;
