declare module "better-auth" {
  interface User {
    role: "USER" | "ADMIN";
    phone?: string | null;
    isActive: boolean;
    isBanned: boolean;
  }
}
