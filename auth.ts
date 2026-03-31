import NextAuth from "next-auth";

import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const allowedEmails = new Set(env.adminAllowedEmails);
const entraIssuer = `https://login.microsoftonline.com/${env.azureTenantId}/v2.0`;

const normalizeEmail = (value: unknown) => String(value ?? "").trim().toLowerCase();

const extractEmailCandidates = (
  userEmail: unknown,
  profile: Record<string, unknown> | undefined,
) => {
  const rawEmails = [
    userEmail,
    profile?.email,
    profile?.preferred_username,
    profile?.upn,
    profile?.unique_name,
  ];

  const additionalEmails = Array.isArray(profile?.emails) ? profile.emails : [];
  const candidates = [...rawEmails, ...additionalEmails].map(normalizeEmail).filter(Boolean);

  return [...new Set(candidates)];
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  basePath: "/api/auth",
  secret: env.nextAuthSecret,
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    {
      id: "microsoft-entra-id",
      name: "Microsoft Entra ID",
      type: "oidc",
      clientId: env.azureClientId,
      clientSecret: env.azureClientSecret,
      issuer: entraIssuer,
      wellKnown: `${entraIssuer}/.well-known/openid-configuration`,
      authorization: {
        params: {
          scope: "openid profile email User.Read",
        },
      },
      profile(profile: Record<string, unknown>) {
        const [email = ""] = extractEmailCandidates(undefined, profile);

        return {
          id: String(profile.sub ?? profile.oid ?? ""),
          name: String(profile.name ?? ""),
          email,
          image: null,
        };
      },
    },
  ],
  callbacks: {
    async signIn({ user, profile, account }) {
      const profileRecord = profile as Record<string, unknown> | undefined;
      const emailCandidates = extractEmailCandidates(user.email, profileRecord);
      const email = emailCandidates.find((candidate) => allowedEmails.has(candidate));

      if (!email) {
        console.warn("[auth] Admin access denied for Microsoft account.", {
          candidates: emailCandidates,
          allowedEmails: [...allowedEmails],
        });
        return false;
      }

      const azureAdId = String(profileRecord?.oid ?? account?.providerAccountId ?? "");

      const admin = await prisma.adminProfile.upsert({
        where: { email },
        update: {
          azureAdId: azureAdId || undefined,
          name: user.name ?? undefined,
          avatarUrl: user.image ?? undefined,
          lastLoginAt: new Date(),
        },
        create: {
          email,
          azureAdId: azureAdId || undefined,
          name: user.name ?? undefined,
          avatarUrl: user.image ?? undefined,
          lastLoginAt: new Date(),
        },
      });

      user.adminId = admin.id;
      user.isAdmin = admin.isActive;
      return admin.isActive;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        token.adminId = user.adminId;
        token.isAdmin = user.isAdmin;
        return token;
      }

      if (!token.email) {
        return token;
      }

      const admin = await prisma.adminProfile.findUnique({
        where: { email: String(token.email).toLowerCase() },
        select: {
          id: true,
          isActive: true,
        },
      });

      token.adminId = admin?.id;
      token.isAdmin = Boolean(admin?.isActive);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.adminId = token.adminId;
        session.user.isAdmin = Boolean(token.isAdmin);
      }

      return session;
    },
  },
});
