import NextAuth from 'next-auth'
import prisma from '@/prisma/client'
import { PrismaAdapter } from '@auth/prisma-adapter'
import authConfig from '@/auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma),
	session: { strategy: 'jwt' },
	...authConfig,
	// callbacks: {
	// authorized: async ({ request, auth }) => {
	// const { pathname } = request.nextUrl
	// console.log('🚀 ~ authorized: ~ pathname:', pathname)
	// if (pathname.includes('/note/edit')) return !!auth
	// return true
	// return !!auth
	// },
	// async jwt({ token, user, account }) {
	// 	console.log('🚀 ~ jwt ~ token, user, account:', token, user, account)
	// 	if (account && account.type === 'credentials' && user) {
	// 		token.userId = user.id
	// 	}
	// 	return token
	// },
	// async session({ session, token }) {
	// 	console.log('🚀 ~ session ~ session, token:', session, token)
	// 	session.user.id = token.userId as string
	// 	return session
	// },
	// },
})
