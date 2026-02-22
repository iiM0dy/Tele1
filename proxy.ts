import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function proxy(req) {
    const { pathname } = req.nextUrl

    // Redirect /admin to /admin/dashboard
    if (pathname === '/admin' || pathname === '/admin/') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow access to login page
        if (pathname.startsWith('/admin/login')) {
          return true
        }

        // Protect ALL other admin routes
        if (pathname.startsWith('/admin')) {
          // Must be logged in
          if (!token) return false;

          // Must have admin role
          const role = token.role as string;
          return role === 'ADMIN' || role === 'SUPER_ADMIN';
        }

        return true
      },
    },
    pages: {
      signIn: '/admin/login',
    }
  }
)

export const config = {
  matcher: ['/admin/:path*']
}
