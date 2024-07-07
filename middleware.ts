import authConfig from '@/auth.config'
import { defaultLocale, locales } from '@/config'
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes, SIGN_IN_ROUTE } from '@/routes'
import NextAuth from 'next-auth'
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

/**
 * 检测是否是公共路由的正则方法 项目做了国际化 所以需要匹配多语言前缀
 * @param routes
 * @param path
 * @returns
 */
const routeTester = (routes: string[], path: string) => {
  const Regex = RegExp(
    `^(/(${locales.join('|')}))?(${routes.flatMap((p) => (p === '/' ? ['', '/'] : p)).join('|')})/?$`,
    'i'
  )
  return Regex.test(path)
}

// export default auth((req) => {
//   console.log('🚀 ~ authMiddleware ~ ROUTE:', req.nextUrl.pathname)
//   const { nextUrl } = req

//   // 登录状态
//   const isLoggedIn = !!req.auth
//   console.log('🚀 ~ authMiddleware ~ isLoggedIn:', isLoggedIn)

//   // 是否是访问后台鉴权接口
//   const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
//   console.log('🚀 ~ authMiddleware ~ isApiAuthRoute:', isApiAuthRoute)

//   // 是否是公共路由
//   const isPublicRoute = routeTester(publicRoutes, nextUrl.pathname)
//   // const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
//   console.log('🚀 ~ authMiddleware ~ isPublicRoute:', isPublicRoute)

//   // 是否是授权路由 如登录页 注册页
//   const isAuthRoute = routeTester(authRoutes, nextUrl.pathname)
//   console.log('🚀 ~ authMiddleware ~ isAuthRoute:', isAuthRoute)

//   // 1. 如果是后台接口 直接 return null 不做任何处理
//   if (isApiAuthRoute) {
//     // ApiAuthRoute 是后台接口 不需要国际化 所以直接 return null 不做任何处理
//     return
//   }

//   // 2. 如果是授权路由 如登录页 注册页
//   if (isAuthRoute) {
//     // 已登录，直接跳转到默认登录重定向地址
//     if (isLoggedIn) {
//       return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
//     }
//     // 未登录，继续执行 访问登录页 注册页
//     return intlMiddleware(req)
//   }

//   // 3. 如果未登录 且 访问鉴权路由 则 跳转到登录页
//   if (!isLoggedIn && !isPublicRoute) {
//     // return Response.redirect(new URL(`/api/auth/signin?callbackUrl=${encodeURIComponent(nextUrl.toString())}`, nextUrl))
//     let callbackUrl = nextUrl.pathname
//     if (nextUrl.search) {
//       callbackUrl += nextUrl.search
//     }
//     const encodedCallbackUrl = encodeURIComponent(callbackUrl)
//     return Response.redirect(new URL(`${SIGN_IN_ROUTE}?callbackUrl=${encodedCallbackUrl}`, nextUrl))
//   }

//   // 4. 如果是公共路由 则交由国际化中间件处理
//   return intlMiddleware(req)
// })

// 创建 next-intl 中间件
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
})

const authMiddleware = auth((req) => {
  console.log('🚀 ~ authMiddleware ~ ROUTE:', req.nextUrl.pathname)
  const { nextUrl } = req
  // 登录状态
  const isLoggedIn = !!req.auth
  console.log('🚀 ~ authMiddleware ~ isLoggedIn:', isLoggedIn)
  // 是否是访问后台鉴权接口
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  console.log('🚀 ~ authMiddleware ~ isApiAuthRoute:', isApiAuthRoute)
  // 是否是公共路由
  const isPublicRoute = routeTester(publicRoutes, nextUrl.pathname)
  // const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  console.log('🚀 ~ authMiddleware ~ isPublicRoute:', isPublicRoute)
  // 是否是授权路由 如登录页 注册页
  const isAuthRoute = routeTester(authRoutes, nextUrl.pathname)
  console.log('🚀 ~ authMiddleware ~ isAuthRoute:', isAuthRoute)

  if (isApiAuthRoute) return

  if (!isLoggedIn && !isAuthRoute) {
    return NextResponse.redirect(new URL(SIGN_IN_ROUTE, nextUrl))
  }

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
  }

  // if (!isLoggedIn && !isPublicRoute) {
  //   // Redirect unauthorized users to login for non-public routes
  //   let callbackUrl = nextUrl.pathname
  //   if (nextUrl.search) {
  //     callbackUrl += nextUrl.search
  //   }
  //   const encodedCallbackUrl = encodeURIComponent(callbackUrl)
  //   return Response.redirect(new URL(`${SIGN_IN_ROUTE}?callbackUrl=${encodedCallbackUrl}`, nextUrl))
  // }

  return intlMiddleware(req)

  // if (isAuthRoute) {
  //   if (isLoggedIn) {
  //     // Redirect logged-in users from auth routes
  //     return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
  //   }
  //   return intlMiddleware(req)
  // }

  // if (!isLoggedIn && !isPublicRoute) {
  //   // Redirect unauthorized users to login for non-public routes
  //   let callbackUrl = nextUrl.pathname
  //   if (nextUrl.search) {
  //     callbackUrl += nextUrl.search
  //   }
  //   const encodedCallbackUrl = encodeURIComponent(callbackUrl)
  //   return Response.redirect(new URL(`${SIGN_IN_ROUTE}?callbackUrl=${encodedCallbackUrl}`, nextUrl))
  // }

  // if (isLoggedIn) {
  //   return intlMiddleware(req) // Apply internationalization for logged-in users
  // }
})

export default function middleware(req: NextRequest) {
  const { nextUrl } = req
  const isAuthRoute = routeTester(authRoutes, nextUrl.pathname)
  const isPublicRoute = routeTester(publicRoutes, nextUrl.pathname)

  if (isAuthRoute) {
    return (authMiddleware as any)(req)
  }

  if (isPublicRoute) {
    return intlMiddleware(req)
  } else {
    return (authMiddleware as any)(req)
  }
}

// 配置匹配器
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
}
