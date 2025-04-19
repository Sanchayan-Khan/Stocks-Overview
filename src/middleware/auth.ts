import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isStockPage = request.nextUrl.pathname.startsWith('/stocks');
  const isAuthPage = ['/login'].includes(request.nextUrl.pathname);

  if (!token && isStockPage) {
    // Redirect to login if trying to access stock pages without authentication
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isAuthPage) {
    // Redirect to home if already authenticated and trying to access auth pages
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    if (token) {
      const verified = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      const response = NextResponse.next();
      response.headers.set('user-info', JSON.stringify(verified.payload));
      return response;
    }
    return NextResponse.next();
  } catch (error) {
    if (isStockPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/stocks/:path*', '/login']
};