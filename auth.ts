import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Phone Number",
      credentials: {
        phoneNumber: { label: "Phone Number", type: "tel" },
      },
      async authorize(credentials) {
        const phone = credentials?.phoneNumber as string | undefined;

        if (!phone) return null;

        // Look up the user by phone number in the database
        const user = await prisma.user.findUnique({
          where: { phoneNumber: phone },
        });

        if (!user) return null;

        // Return a plain object — NextAuth will persist this in the JWT
        return {
          id: user.id,
          phoneNumber: user.phoneNumber,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    // Persist id and role into the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phoneNumber = (user as { phoneNumber: string }).phoneNumber;
        token.role = (user as { role: Role }).role;
      }
      return token;
    },
    // Expose id and role on the session object (accessible via useSession / auth())
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.phoneNumber = token.phoneNumber as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
});
