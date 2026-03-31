import { auth } from "@/auth";

export const proxy = auth((req) => {
  if (req.nextUrl.pathname === "/admin/login") {
    return;
  }

  if (!req.auth?.user?.isAdmin) {
    return Response.redirect(new URL("/admin/login", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
