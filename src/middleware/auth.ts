import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Paths that don't require authentication
  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isPublicPath) {
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
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/', '/stocks/:path*', '/login', '/register']
};