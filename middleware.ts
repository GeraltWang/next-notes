import authConfig from '@/auth.config'
import { defaultLocale, locales } from '@/config'
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes, SIGN_IN_ROUTE } from '@/routes'
import NextAuth from 'next-auth'
import createMiddleware from 'next-intl/middleware'

const { auth } = NextAuth(authConfig)

const routeTester = (routes: string[], path: string) => {
  const Regex = RegExp(
    `^(/(${locales.join('|')}))?(${routes.flatMap((p) => (p === '/' ? ['', '/'] : p)).join('|')})/?$`,
    'i'
  )
  return Regex.test(path)
}

export default auth((req) => {
  console.log('🚀 ~ authMiddleware ~ ROUTE:', req.nextUrl.pathname)
  const { nextUrl } = req

  const isLoggedIn = !!req.auth
  console.log('🚀 ~ authMiddleware ~ isLoggedIn:', isLoggedIn)

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  console.log('🚀 ~ authMiddleware ~ isApiAuthRoute:', isApiAuthRoute)

  const isPublicRoute = routeTester(publicRoutes, nextUrl.pathname)
  console.log('🚀 ~ authMiddleware ~ isPublicRoute:', isPublicRoute)

  const isAuthRoute = routeTester(authRoutes, nextUrl.pathname)
  console.log('🚀 ~ authMiddleware ~ isAuthRoute:', isAuthRoute)

  if (isApiAuthRoute) {
    return
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return
  }

  if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
    let callbackUrl = nextUrl.pathname
    if (nextUrl.search) {
      callbackUrl += nextUrl.search
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    return Response.redirect(new URL(`${SIGN_IN_ROUTE}?callbackUrl=${encodedCallbackUrl}`, nextUrl))
  }

  return intlMiddleware(req)
})

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}
