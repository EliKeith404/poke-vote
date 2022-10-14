import { Accordion, Anchor, Container } from '@mantine/core';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

const AboutPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>About | PokeVote</title>
        <meta property="og:title" content="About/FAQ | PokeVote" />
        <meta
          name="description"
          content="What is the PokeVote site about? Why is this important? Is this sponsored by the Pokemon Company? Where does this data go? Most of these questions are probably not likely answered here!"
        />
        <meta name="image" property="og:image" content="/assets/preview.png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Container>
        <h1 className="text-2xl md:text-3xl">About/FAQ</h1>
        <Accordion
          variant="contained"
          radius="md"
          order={3}
          defaultValue="whatIsThis"
        >
          <Accordion.Item value="whatIsThis">
            <Accordion.Control>What is this?</Accordion.Control>
            <Accordion.Panel>
              A voting app designed to gather data on how the community would
              rank Pokemon given subjective categories.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="roundest">
            <Accordion.Control>
              What happened to voting on the roundest??
            </Accordion.Control>
            <Accordion.Panel>
              Some Pokemon don&apos;t fit into that category. Some are too sharp
              or too square. I would like to include as many Pokemon as possible
              into this app, all 905 (currently) of them. New vote categories
              are being added all the time, so check back for new votes!
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="sign-in">
            <Accordion.Control>Why do I need to sign in?</Accordion.Control>
            <Accordion.Panel>
              To add an extra layer of security so bots don&apos;t eat up my
              precious bandwidth (alt: I don&apos;t wanna push past my free
              limits).
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="source-code">
            <Accordion.Control>Where&apos;s the source code?</Accordion.Control>
            <Accordion.Panel>
              You can find all of my projects and their source code on my{' '}
              <Link href={'https://www.elikeith.dev/#projects'} passHref>
                <Anchor component={'a'} target={'_blank'}>
                  portfolio website
                </Anchor>
              </Link>{' '}
              under the &#8220;Projects&#8221; section.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Container>
    </>
  );
};

export default AboutPage;
