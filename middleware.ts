import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/config'
import NextAuth from 'next-auth'
import authConfig from '@/auth.config'
import { publicRoutes, authRoutes, apiAuthPrefix, DEFAULT_LOGIN_REDIRECT } from '@/routes'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
	console.log("🚀 ~ authMiddleware ~ ROUTE:", req.nextUrl.pathname)
	const { nextUrl } = req

	// 登录状态
	const isLoggedIn = !!req.auth
	console.log("🚀 ~ authMiddleware ~ isLoggedIn:", isLoggedIn)

	// 是否是访问后台鉴权接口
	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
	console.log("🚀 ~ authMiddleware ~ isApiAuthRoute:", isApiAuthRoute)

	// 检测是否是公共路由的正则 项目做了国际化 所以需要匹配多语言前缀
	const publicPathnameRegex = RegExp(
		`^(/(${locales.join('|')}))?(${publicRoutes.flatMap(p => (p === '/' ? ['', '/'] : p)).join('|')})/?$`,
		'i'
	)
	// 是否是公共路由
	const isPublicRoute = publicPathnameRegex.test(nextUrl.pathname)
	// const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
	console.log("🚀 ~ authMiddleware ~ isPublicRoute:", isPublicRoute)

	// 是否是授权路由 如登录页 注册页
	const isAuthRoute = authRoutes.includes(nextUrl.pathname)
	console.log("🚀 ~ authMiddleware ~ isAuthRoute:", isAuthRoute)
	
	// 1. 如果是后台接口 直接 return null 不做任何处理
	if (isApiAuthRoute) {
		// ApiAuthRoute 是后台接口 不需要国际化 所以直接 return null 不做任何处理
		return null
	}

	// 2. 如果是授权路由 如登录页 注册页
	if (isAuthRoute) {
		// 已登录，直接跳转到默认登录重定向地址
		if (isLoggedIn) {
			return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
		}
		// 未登录，继续执行 访问登录页 注册页
		return intlMiddleware(req)
	}

	// 3. 如果未登录 且 访问鉴权路由 则 跳转到登录页
	if (!isLoggedIn && !isPublicRoute) {
		return Response.redirect(new URL(`/api/auth/signin?callbackUrl=${encodeURIComponent(nextUrl.toString())}`, nextUrl))
	}

	// 4. 如果是公共路由 则交由国际化中间件处理
	return intlMiddleware(req)
})

// 创建 next-intl 中间件
const intlMiddleware = createMiddleware({
	locales,
	defaultLocale,
	localePrefix: 'as-needed',
})

// 配置匹配器
export const config = {
	matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
