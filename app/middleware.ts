import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_SESSION_COOKIE = 'warpion_admin_session';

const protectedPaths = ['/', '/stuck-commands', '/failed-commands', '/orders'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedPath =
    protectedPaths.includes(pathname) ||
    protectedPaths.some(
      (path) => path !== '/' && pathname.startsWith(`${path}/`)
    );

  const isLoginPage = pathname === '/login';
  const hasSession =
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value === 'authenticated';

  if (isProtectedPath && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && hasSession) {
    const dashboardUrl = new URL('/', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};