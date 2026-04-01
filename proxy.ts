import { NextResponse } from "next/server";

import { auth } from "@/auth";

export default auth((req) => {
  if (req.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (!req.auth?.user?.isAdmin) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
