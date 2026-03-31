import Image from "next/image";
import { redirect } from "next/navigation";

import logoHeader from "@/app/assets/headerlogo.svg";
import { AdminSignInButton } from "@/components/auth/admin-sign-in-button";
import { getAdminSession } from "@/lib/authz";

const errorMessages: Record<string, string> = {
  AccessDenied: "This Microsoft account is not allowed to access the admin portal.",
  Configuration: "Authentication is not configured correctly yet. Check the Entra redirect URI and restart the app.",
  Default: "Sign-in failed. Please try again.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await getAdminSession();
  if (session?.user?.isAdmin) {
    redirect("/admin");
  }

  const params = (await searchParams) ?? {};
  const callbackUrl = params.callbackUrl || "/admin";
  const errorMessage = params.error ? errorMessages[params.error] ?? errorMessages.Default : null;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto flex min-h-screen max-w-[760px] items-center px-6 py-8 sm:px-8">
        <section className="w-full rounded-[32px] border border-slate-200/80 bg-white p-7 shadow-[0_24px_80px_rgba(148,163,184,0.14)] sm:p-10">
          <Image
            alt="Pryceless Ventures"
            className="h-auto w-[280px]"
            priority
            src={logoHeader}
          />

          <h1 className="mt-10 text-[52px] font-semibold leading-[0.96] tracking-[-0.06em] text-[#1e2b57] sm:text-[60px]">
            Welcome Back
          </h1>
          <p className="mt-4 text-[18px] leading-8 text-slate-600">
            Sign in with Microsoft Entra ID to continue.
          </p>

          {errorMessage ? (
            <div className="mt-8 rounded-[20px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="mt-8 rounded-[24px] border border-slate-200 bg-[#f8fafc] px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Secure sign-in
            </p>
            <p className="mt-3 text-[16px] leading-8 text-slate-600">
              Use your approved company account.
            </p>
          </div>

          <AdminSignInButton callbackUrl={callbackUrl} />

          <p className="mt-8 text-[15px] leading-7 text-slate-500">
            If your session is already active, you will be redirected automatically.
          </p>
        </section>
      </div>
    </div>
  );
}
