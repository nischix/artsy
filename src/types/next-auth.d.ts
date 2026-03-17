import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      isCreator: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    isCreator: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    isCreator?: boolean;
  }
}

