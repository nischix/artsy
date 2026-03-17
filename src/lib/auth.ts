import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Email',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const email = credentials?.email?.trim().toLowerCase();
                const password = credentials?.password;
                if (!email || !password) return null;

                const user = await prisma.user.findUnique({
                    where: { email },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        password: true,
                        isCreator: true,
                    },
                });

                if (!user?.password) return null;
                const valid = await bcrypt.compare(password, user.password);
                if (!valid) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email ?? email,
                    isCreator: user.isCreator,
                };
            },
        }),
    ],
    session: { strategy: 'jwt' },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                const maybeIsCreator = (user as { isCreator?: unknown }).isCreator;
                if (typeof maybeIsCreator === 'boolean') {
                    token.isCreator = maybeIsCreator;
                    return token;
                }
            }

            if ((!token.id || token.isCreator === undefined) && token.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: String(token.email).trim().toLowerCase() },
                    select: { id: true, isCreator: true },
                });
                if (dbUser) {
                    token.id = dbUser.id;
                    token.isCreator = dbUser.isCreator;
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = String(token.id ?? token.sub ?? '');
                session.user.isCreator = Boolean(token.isCreator);
            }
            return session;
        },
    },
};
