import { Container } from '@mantine/core';
import Image from 'next/image';
import React from 'react';

const PageNotFound = () => {
  return (
    <Container className="flex flex-col justify-center items-center max-w-2xl h-full">
      <h1 className="text-3xl md:text-4xl text-center">404: Page Not Found!</h1>
      <div className="-my-12">
        <Image
          style={{ imageRendering: 'pixelated' }}
          src={
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/404.png'
          }
          alt={'Pokemon #404, Luxio'}
          title={'Pokemon #404, Luxio'}
          width={250}
          height={250}
        />
      </div>
      <p className="text-center">
        Schwoopsies, this page does not exist on the server. Since you managed
        to dig your own tunnel, I&apos;ll let you in on a little secret: the
        data collected by the votes will have a direct impact to the tournament
        I&apos;m planning for the Bond&apos;s Discord Server!
      </p>
    </Container>
  );
};

export default PageNotFound;
