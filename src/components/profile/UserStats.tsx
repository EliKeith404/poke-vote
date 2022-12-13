import React from 'react';
import { IUser } from '../../types/user';
import { trpc } from '../../utils/trpc';

const UserStats = ({ user }: { user: IUser }) => {
  const userVoteCount = trpc.useQuery(['user.get-votes', { id: user?.id }], {
    refetchOnReconnect: true,
  });

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
          <span className="font-normal">{userVoteCount.data ?? 0}</span>
        </span>
      </div>
    </div>
  );
};

export default UserStats;
