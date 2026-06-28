import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare, hash } from 'bcryptjs';
import { db } from '@/lib/db';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? '';

const providers: NextAuthOptions['providers'] = [
  CredentialsProvider({
    id: 'credentials',
    name: 'Email & Password',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(creds) {
      if (!creds?.email || !creds?.password) return null;
      const email = creds.email.toLowerCase().trim();
      const user = await db.user.findUnique({ where: { email } });
      if (!user || !user.passwordHash) return null;
      const ok = await compare(creds.password, user.passwordHash);
      if (!ok) return null;
      return {
        id: user.id,
        email: user.email,
        name: user.name ?? undefined,
        image: user.image ?? undefined,
      };
    },
  }),
];

// Only register Google provider when credentials are present.
// This prevents the OAuthSignin error when the env vars are empty.
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    // Use a custom sign-in route rendered inside our app.
    signIn: '/?view=login',
    error: '/?view=login&error=1',
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // First sign-in: persist user info into the JWT token.
      // `user` is the object returned from authorize() (credentials)
      // or by the OAuth provider (Google). `account` is set on first login only.
      if (account) {
        if (user) {
          token.id = (user as { id?: string }).id ?? token.id;
          token.email = user.email ?? token.email;
          token.name = user.name ?? token.name;
          token.picture = (user as { image?: string | null }).image ?? token.picture;
        }
        // OAuth flow (Google): ensure the user exists in our DB.
        if (profile) {
          const email = profile.email ?? user?.email ?? '';
          const name = profile.name ?? user?.name ?? email.split('@')[0];
          const image = (profile as { picture?: string | null }).picture ?? null;

          if (email) {
            await db.user.upsert({
              where: { email },
              update: { name, image: image ?? undefined, updatedAt: new Date() },
              create: { email, name, image: image ?? undefined },
            });

            const dbUser = await db.user.findUnique({ where: { email } });
            if (dbUser) token.id = dbUser.id;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string | null;
      }
      return session;
    },
  },
};

/** Helper exported for the register route — produces a bcrypt hash. */
export async function hashPassword(plain: string): Promise<string> {
  return hash(plain, 10);
}
