import authConfig from '@/auth.config'
import { defaultLocale, locales } from '@/config'
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes, SIGN_IN_ROUTE } from '@/routes'
import NextAuth from 'next-auth'
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
})

const authMiddleware = auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  // const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  // Handle different route scenarios
  if (isApiAuthRoute) return // Don't modify API authentication routes

  if (isLoggedIn) {
    if (isAuthRoute) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return intlMiddleware(req)
  } else {
    return Response.redirect(new URL(SIGN_IN_ROUTE, nextUrl))
  }
})

export default function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${publicRoutes.flatMap((p) => (p === '/' ? ['', '/'] : p)).join('|')})/?$`,
    'i'
  )

  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname)
  console.log('🚀 ~ middleware ~ isPublicPage:', isPublicPage)

  if (isPublicPage) {
    return intlMiddleware(req) // Apply internationalization for public pages
  } else {
    return (authMiddleware as any)(req) // Apply authentication logic for non-public pages
  }
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
