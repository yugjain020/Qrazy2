import { NextResponse, type NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/reset-password',
  '/verify-email',
  '/onboarding/select-business',
];

// Define auth routes (redirect to dashboard if already logged in)
const authRoutes = ['/login', '/signup', '/reset-password', '/verify-email'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith('/ar/')
  );

  const isAuthRoute = authRoutes.some((route) => pathname === route);

  // For now, we rely on client-side auth checks (Firebase Auth)
  // The middleware handles initial routing logic
  // Firebase Auth tokens are verified client-side in our layout components

  // Allow all requests through — actual auth checks happen in:
  // - (auth)/layout.tsx (redirects to dashboard if logged in)
  // - (dashboard)/layout.tsx (redirects to login if not logged in)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, models, etc.)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|images|models|api).*)',
  ],
};