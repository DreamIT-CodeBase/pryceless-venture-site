import Image from "next/image";

import logoHeader from "@/app/assets/headerlogo.svg";
import { AdminSidebarNav } from "@/components/admin/admin-sidebar-nav";

export function AdminSidebar() {
  return (
    <aside className="relative flex h-screen w-[298px] shrink-0 flex-col overflow-hidden border-r border-white/12 bg-[linear-gradient(180deg,#4a3de8_0%,#493ddb_42%,#3532a4_100%)] px-5 py-6 text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),transparent_30%),linear-gradient(180deg,transparent,rgba(8,9,45,0.16))]"
      />

      <div className="relative flex items-start justify-between gap-4">
        <Image
          alt="Pryceless Ventures"
          className="h-auto w-[176px]"
          priority
          src={logoHeader}
        />
        <div className="grid h-11 w-11 place-items-center rounded-[14px] border border-white/16 bg-white/6 text-white/85">
          <span className="grid h-5 w-5 grid-cols-2 gap-1">
            <span className="rounded-[4px] border border-current" />
            <span className="rounded-[4px] border border-current" />
          </span>
        </div>
      </div>

      <div className="relative">
        <AdminSidebarNav />
      </div>
    </aside>
  );
}
