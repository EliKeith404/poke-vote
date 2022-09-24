import Link from 'next/link';
import React from 'react';

const Navbar = () => {
  return (
    <div className="w-full absolute block py-5">
      <ul className="flex justify-center">
        <li className="px-5">
          <Link href={'/'}>Home</Link>
        </li>
        <li className="px-5">
          <Link href={'/results'}>Results</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
