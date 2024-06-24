import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/config'
import { auth } from 'auth'

// 创建 next-intl 中间件
const intlMiddleware = createMiddleware({
	locales,
	defaultLocale,
	localePrefix: 'as-needed',
})

const authMiddleware = auth(req => {
	const session = req.auth

	if (session) {
		return intlMiddleware(req)
	} else {
		// 获取当前请求的完整URL
		const currentUrl = req.nextUrl.clone()
		// 重定向到登录页
		return NextResponse.redirect(
			new URL(`/api/auth/signin?callbackUrl=${encodeURIComponent(currentUrl.toString())}`, req.url)
		)
	}
})

const publicPages = ['/', '/login', '/note/\\d+']

export default function middleware(req: NextRequest) {
	const publicPathnameRegex = RegExp(
		`^(/(${locales.join('|')}))?(${publicPages.flatMap(p => (p === '/' ? ['', '/'] : p)).join('|')})/?$`,
		'i'
	)
	const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname)
	if (isPublicPage) {
		console.log(isPublicPage)

		return intlMiddleware(req)
	} else {
		return (authMiddleware as any)(req)
	}
}

// 配置匹配器
export const config = {
	matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
