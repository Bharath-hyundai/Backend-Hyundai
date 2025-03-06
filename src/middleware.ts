import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token"); // Checking if the token exists

  // Allow access to the login page and API without authentication
  if (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next(); // Allow access if token exists
}

// Apply middleware to protect pages
export const config = {
  matcher: ["/dashboard/:path*", "/dashboard"], // Protect dashboard & subroutes
};
