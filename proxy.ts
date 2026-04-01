import { NextResponse } from "next/server";

import { auth } from "@/auth";

const adminProxy = auth((req) => {
  if (req.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (!req.auth?.user?.isAdmin) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
});

export default function proxy(...args: Parameters<typeof adminProxy>) {
  return adminProxy(...args);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
