import Link from "next/link";

import {
  AdminBookIcon,
  AdminCreateIcon,
  AdminDocumentIcon,
} from "@/components/admin/admin-icons";

const resourceLinks = [
  {
    href: "/admin/documentation",
    label: "Documentation",
    icon: AdminBookIcon,
  },
  {
    href: "/admin/how-to-create",
    label: "How to Create",
    icon: AdminCreateIcon,
  },
  {
    href: "/admin/creation-doc",
    label: "Creation Doc",
    icon: AdminDocumentIcon,
  },
] as const;

export function AdminResourceLinks() {
  return (
    <nav aria-label="Admin resources" className="rounded-[26px] border border-slate-200/80 bg-white/88 px-5 py-4 shadow-[0_18px_50px_rgba(148,163,184,0.16)] backdrop-blur">
      <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
        {resourceLinks.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              className="inline-flex items-center gap-3 text-[17px] font-medium text-[#4a3de8] transition hover:text-[#3127b5]"
              href={item.href}
              key={item.href}
            >
              <Icon className="h-[18px] w-[18px]" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
