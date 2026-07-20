import { Role } from "./enums";

declare module "better-auth" {
  interface User {
    role: Role;
    phone?: string | null;
    isActive: boolean;
    isBanned: boolean;
  }
}
