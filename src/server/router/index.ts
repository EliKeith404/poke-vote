// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { pokeRouter } from './pokeRouter';
import { protectedExampleRouter } from './protected-example-router';
import { userRouter } from './userRouter';
import { tournamentRouter } from './tournamentRouter';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('poke.', pokeRouter)
  .merge('user.', userRouter)
  .merge('tournament.', tournamentRouter)
  .merge('auth.', protectedExampleRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
