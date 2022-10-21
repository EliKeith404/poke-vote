import { Category, Role } from '@prisma/client';
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
    } & DefaultSession['user'];
  }

  interface User {
    role: Role;
    assignedCategory: Category;
  }
}
