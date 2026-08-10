import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public and protected routes
const publicRoutes = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/new-password",
  "/auth/verify"
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the auth token from cookies
  const token = request.cookies.get("auth_token")?.value;
  
  // Check if the current route is an auth page (public)
  const isAuthRoute = publicRoutes.some((route) => pathname.startsWith(route));
  
  // Check if the route is a dashboard route (protected)
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // If the user has a token and tries to access an auth page, redirect to dashboard
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the user doesn't have a token and tries to access the dashboard, redirect to sign-in
  if (!token && isDashboardRoute) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public images)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
