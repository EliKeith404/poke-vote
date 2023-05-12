import { Avatar, Container, Group } from '@mantine/core';
import React, { useEffect } from 'react';
import { GoBook, GoGear } from 'react-icons/go';
import { IUser } from '../../types/user';

const UserCard = ({ user, owned }: { user: IUser; owned: boolean }) => {
  if (!user) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Container className="rounded-xl p-5 bg-gray-700">
      <Group>
        <Avatar
          src={user.image}
          alt={`${user.name}'s profile picture`}
          radius={40}
          size={'xl'}
        />
        <h2 className={'font-medium'}>{user.name}</h2>
      </Group>
      <div className="flex flex-col items-start w-full">
        <nav className="w-full">
          <h4 className="mb-[-0.5rem] uppercase">GENERAL</h4>
          <ul className="list-none w-full list-outside p-0">
            <li className="flex items-center py-1 px-2 w-full rounded-lg hover:bg-slate-600 text-left hover:cursor-pointer">
              <GoBook />
              <span className="pl-2">Overview</span>
            </li>
            {owned && (
              <>
                <li className="flex items-center py-1 px-2 w-full rounded-lg hover:bg-slate-600 hover:cursor-pointer">
                  <GoGear />
                  <span className="pl-2">Settings</span>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </Container>
  );
};

export default UserCard;
