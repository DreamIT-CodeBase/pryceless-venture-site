import Image from "next/image";
import { ReactNode } from "react";

import logoHeader from "@/app/assets/headerlogo.svg";
import {
  AdminChevronDownIcon,
  AdminGlobeIcon,
  AdminHelpIcon,
  AdminMoonIcon,
} from "@/components/admin/admin-icons";
import { AdminResourceLinks } from "@/components/admin/admin-resource-links";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { getAdminSession } from "@/lib/authz";

const getInitials = (name: string, email: string) => {
  const source = name.trim() || email.trim() || "PV";
  const words = source.split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "PV";
};

export async function AdminShell({
  children,
  title,
  showPageHeader = true,
  showResourceLinks = true,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  showPageHeader?: boolean;
  showResourceLinks?: boolean;
  subtitle?: string;
}) {
  const session = await getAdminSession();
  const userName = session?.user?.name?.trim() || "Admin";
  const userEmail = session?.user?.email?.trim() || "admin@prycelessventures.com";
  const userImage = session?.user?.image?.trim() || null;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(98,87,255,0.12),transparent_26%),radial-gradient(circle_at_top_right,_rgba(110,141,255,0.11),transparent_24%),linear-gradient(180deg,#f6f8ff_0%,#eef3ff_100%)] text-slate-900">
      <div className="flex min-h-screen">
        <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-[298px]">
          <AdminSidebar />
        </div>

        <main className="min-w-0 flex-1 lg:ml-[298px]">
          <div className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/92 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 lg:px-8">
              <div className="flex items-center gap-4">
                <div className="block lg:hidden">
                  <Image
                    alt="Pryceless Ventures"
                    className="h-auto w-[150px]"
                    priority
                    src={logoHeader}
                  />
                </div>
                <div className="hidden items-center gap-3 lg:flex">
                  <span className="text-[14px] font-semibold text-slate-950">Pryceless Venture</span>
                  <AdminChevronDownIcon className="h-4 w-4 text-slate-700" />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <a
                  className="inline-flex items-center rounded-[16px] border border-[#f0b464] bg-[#fff7eb] px-4 py-2.5 text-sm font-semibold text-[#ea8c18] transition hover:border-[#e59a38] hover:bg-[#fff1d6]"
                  href="/"
                >
                  View website
                </a>
                <button
                  aria-label="Language"
                  className="grid h-11 w-11 place-items-center rounded-[14px] border border-slate-200 bg-white text-slate-700"
                  type="button"
                >
                  <AdminGlobeIcon className="h-[18px] w-[18px]" />
                </button>
                <button
                  aria-label="Display settings"
                  className="grid h-11 w-11 place-items-center rounded-[14px] border border-slate-200 bg-white text-slate-700"
                  type="button"
                >
                  <AdminMoonIcon className="h-[18px] w-[18px]" />
                </button>
                <a
                  aria-label="Help and support"
                  className="grid h-11 w-11 place-items-center rounded-[14px] border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300"
                  href="/admin/documentation"
                >
                  <AdminHelpIcon className="h-[18px] w-[18px]" />
                </a>
                <details className="group relative">
                  <summary className="flex list-none items-center gap-3 rounded-[18px] border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition hover:border-slate-300 [&::-webkit-details-marker]:hidden">
                    <span className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#4a3de8,#6b63ff)] text-sm font-semibold text-white">
                      {userImage ? (
                        <img
                          alt={userName}
                          className="h-full w-full object-cover"
                          src={userImage}
                        />
                      ) : (
                        getInitials(userName, userEmail)
                      )}
                    </span>
                    <div className="hidden text-left sm:block">
                      <p className="text-sm font-semibold text-slate-950">{userName}</p>
                      <p className="text-xs text-slate-500">{userEmail}</p>
                    </div>
                    <AdminChevronDownIcon className="h-4 w-4 text-slate-600 transition group-open:rotate-180" />
                  </summary>

                  <div className="absolute right-0 top-[calc(100%+10px)] z-30 w-[250px] rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(148,163,184,0.2)]">
                    <div className="flex items-center gap-3 rounded-[16px] bg-slate-50 px-3 py-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#4a3de8,#6b63ff)] text-sm font-semibold text-white">
                        {userImage ? (
                          <img
                            alt={userName}
                            className="h-full w-full object-cover"
                            src={userImage}
                          />
                        ) : (
                          getInitials(userName, userEmail)
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-950">{userName}</p>
                        <p className="truncate text-xs text-slate-500">{userEmail}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <SignOutButton variant="menu" />
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>

          <div className="space-y-6 px-5 py-6 lg:px-7">
            {showResourceLinks ? <AdminResourceLinks /> : null}

            {showPageHeader ? (
              <header className="relative overflow-hidden rounded-[30px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(244,241,255,0.97),rgba(236,233,255,0.9))] px-6 py-7 shadow-[0_24px_70px_rgba(148,163,184,0.16)] lg:px-10 lg:py-9">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(rgba(123,97,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(123,97,255,0.06)_1px,transparent_1px)] [background-size:34px_34px]"
                />
                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6d36ff]">
                      Workspace
                    </p>
                    <h2 className="mt-4 text-[34px] font-semibold tracking-[-0.03em] text-slate-950 lg:text-[56px]">
                      {title}
                    </h2>
                    {subtitle ? (
                      <p className="mt-3 max-w-4xl text-[17px] leading-8 text-slate-600">{subtitle}</p>
                    ) : null}
                  </div>
                  <div className="inline-flex items-center self-start rounded-full border border-violet-200 bg-white/86 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-700 shadow-sm shadow-violet-100/70">
                    Microsoft Entra secured
                  </div>
                </div>
              </header>
            ) : null}

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
