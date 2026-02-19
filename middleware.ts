import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth-system'

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value
    const { pathname } = request.nextUrl

    // Protected routes
    const protectedRoutes = ['/mypage', '/post', '/admin']
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

    if (isProtectedRoute) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        const payload = await verifyToken(token)

        if (!payload) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // Redirect to mypage if already logged in and accessing login/register
    if ((pathname === '/login' || pathname === '/register') && token) {
        const payload = await verifyToken(token)
        if (payload) {
            return NextResponse.redirect(new URL('/mypage', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
