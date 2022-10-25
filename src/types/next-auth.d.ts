import { Category, Role, Vote } from '@prisma/client';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      role: Role;
      assignedCategory: Category;
      votes: Vote[];
    } & DefaultSession['user'];
  }

  interface User {
    role: Role;
    assignedCategory: Category;
    votes: Vote[];
  }
}
