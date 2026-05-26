import { NextRequest, NextResponse } from "next/server";
import { sessionService } from "./services/session.service";
import { Roles } from "./constants/roles";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  let isAuthenticated = false;
  let isAdmin = false;

  // const { data } = await sessionService.getSession();
  // console.log("session data", data);

  // Server-side session check — pass request so cookies are forwarded

  try {
    const { data } = await sessionService.getSession();
    // const { data } = await sessionService.getSessionFromRequest(request);

    console.log("session data", data);

    if (data?.user) {
      isAuthenticated = true;
      isAdmin = data.user.role === Roles.admin;
    }
  } catch (error) {
    console.error("Session fetch error in middleware:", error);
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
