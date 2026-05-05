import NextAuth from "next-auth";
import MicrosoftEntraID, { type MicrosoftEntraIDProfile } from "next-auth/providers/microsoft-entra-id";

import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

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

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const allowedEmails = new Set(env.adminAllowedEmails);
  const entraIssuer = `https://login.microsoftonline.com/${env.azureAuthTenantId}/v2.0`;
  const authOrigin = env.authOrigin;

  if (process.env.NODE_ENV === "production") {
    if (!authOrigin) {
      throw new Error(
        "Missing AUTH_URL or NEXTAUTH_URL in production. Set it to your deployed site origin, for example https://example.com.",
      );
    }

    new URL(authOrigin);
  }

  return {
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
      MicrosoftEntraID({
        clientId: env.azureClientId,
        clientSecret: env.azureClientSecret,
        issuer: entraIssuer,
        authorization: {
          params: {
            prompt: "select_account",
            scope: "openid profile email User.Read",
          },
        },
        profile(profile: MicrosoftEntraIDProfile) {
          const profileRecord = profile as unknown as Record<string, unknown>;
          const [email = ""] = extractEmailCandidates(undefined, profileRecord);

          return {
            id: String(profile.sub ?? profile.oid ?? ""),
            name: String(profile.name ?? ""),
            email,
            image: null,
          };
        },
      }),
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
  };
});
