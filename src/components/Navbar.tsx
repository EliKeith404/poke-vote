import Link from 'next/link';
import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <>
      <div className="fixed w-full flex justify-between py-7 bg-slate-700 z-10 shadow-xl">
        <Link href={'/'}>
          <a className="font-pokemon tracking-wider px-10 mt-[-0.6rem] text-2xl">
            PokeVote
          </a>
        </Link>
        <ul className="flex justify-end px-5 font-bold">
          <li className="px-5">
            <Link href={'/'}>
              <a>Home</a>
            </Link>
          </li>
          <li className="px-5">
            <Link href={'/results'}>
              <a>Results</a>
            </Link>
          </li>
          {!session ? (
            // If the user doesn't have an active session, display login button,
            <li className="px-5">
              <button onClick={() => signIn('discord')}>Sign In</button>
            </li>
          ) : (
            // Else display user info and logout button
            <>
              <li className="px-5">
                <Link href="/profile">
                  <a>Profile</a>
                </Link>
              </li>
              <li className="px-5">
                <button onClick={() => signOut()}>Sign Out</button>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Spacer Element */}
      <div className="py-10" />
    </>
  );
};

export default Navbar;
