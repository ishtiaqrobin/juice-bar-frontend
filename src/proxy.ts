import { NextRequest, NextResponse } from "next/server";
import { Roles } from "./constants/roles";
import { sessionService } from "./services/session.service";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  let isAuthenticated = false;
  let isAdmin = false;

  const { data } = await sessionService.getSession();
  // console.log("session data", data);

  if (data) {
    isAuthenticated = true;
    isAdmin = data.user.role === Roles.admin;
  }

  //* Redirect if authenticated user tries to access /login
  if (pathname === "/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  //* User is not authenticated at all
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  //* User is authenticated and role = ADMIN
  //* User can not visit user dashboard
  if (isAdmin && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/admin-dashboard", request.url));
  }

  //* User is authenticated and role = USER
  //* User can not visit admin dashboard
  if (!isAdmin && pathname.startsWith("/admin-dashboard")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/admin-dashboard",
    "/admin-dashboard/:path*",
    "/login",
  ],
};
