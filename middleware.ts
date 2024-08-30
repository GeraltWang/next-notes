import authConfig from '@/auth.config'
import { defaultLocale, locales } from '@/config'
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes, SIGN_IN_ROUTE } from '@/routes'
import NextAuth from 'next-auth'
import createMiddleware from 'next-intl/middleware'
import { NextRequest } from 'next/server'

const { auth } = NextAuth(authConfig)

// const routeTester = (routes: string[], path: string) => {
//   const Regex = RegExp(
//     `^(/(${locales.join('|')}))?(${routes.flatMap((p) => (p === '/' ? ['', '/'] : p)).join('|')})/?$`,
//     'i'
//   )
//   return Regex.test(path)
// }

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
})

const authMiddleware = auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  // Handle different route scenarios
  if (isApiAuthRoute) return // Don't modify API authentication routes

  if (isAuthRoute) {
    if (isLoggedIn) {
      // Redirect logged-in users from auth routes
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return // Don't modify behavior for auth routes
  }

  if (!isLoggedIn && !isPublicRoute) {
    // Redirect unauthorized users to login for non-public routes
    return Response.redirect(new URL(SIGN_IN_ROUTE, nextUrl))
  }

  if (isLoggedIn) {
    return intlMiddleware(req) // Apply internationalization for logged-in users
  }
})

export default function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(<span class="math-inline">\{locales\.join\("\|"\)\}\)\)?\(</span>{publicPages
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`,
    'i'
  )

  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname)

  if (isPublicPage) {
    return intlMiddleware(req) // Apply internationalization for public pages
  } else {
    return (authMiddleware as any)(req) // Apply authentication logic for non-public pages
  }
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}
