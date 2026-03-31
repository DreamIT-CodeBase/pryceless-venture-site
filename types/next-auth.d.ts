import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      adminId?: string;
      isAdmin?: boolean;
    };
  }

  interface User {
    adminId?: string;
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    adminId?: string;
    isAdmin?: boolean;
  }
}
