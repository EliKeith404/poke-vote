import Link from 'next/link';
import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <div className="w-full absolute block py-10">
      <ul className="flex justify-center">
        <li className="px-5">
          <Link href={'/'}>Home</Link>
        </li>
        <li className="px-5">
          <Link href={'/results'}>Results</Link>
        </li>
        {/*<li className="px-5">
          {!session ? (
            // If the user doesn't have an active session, display login button,
            <button onClick={() => signIn('discord')}>Login</button>
          ) : (
            // Else display a logout button
            <button onClick={() => signOut()}>Logout</button>
          )}
          </li>*/}
      </ul>
    </div>
  );
};

export default Navbar;
