import { NextResponse } from 'next/server'

export function middleware(request) {
  const authCookie = request.cookies.get('multimart_session');
  const path = request.nextUrl.pathname;
  
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  // If user is already authenticated and visits /admin/login, redirect to /admin
  if (path === '/admin/login' && authCookie && authCookie.value === 'authenticated') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
