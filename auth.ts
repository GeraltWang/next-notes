import authConfig from '@/auth.config'
import { getUserById } from '@/lib/actions/user.action'
import prisma from '@/prisma/client'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { UserRole } from '@prisma/client'
import NextAuth, { type DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

// extend the session to include the user id and role
declare module 'next-auth' {
	interface Session {
		user: {
			id: string
			role: UserRole
		} & DefaultSession['user']
	}
}

declare module 'next-auth/jwt' {
	/** Returned by the `jwt` callback and `auth`, when using JWT sessions */
	interface JWT {
		role?: UserRole
	}
}

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma),
	session: { strategy: 'jwt' },
	pages: {
		signIn: '/sign-in',
		error: '/error',
	},
	events: {
		async linkAccount({ user }) {
			await prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					emailVerified: new Date(),
				},
			})
		},
	},
	callbacks: {
		// signIn callback checks if the user exists and if the email is verified
		async signIn({ user, account }) {
			if (account?.provider !== 'credentials') {
				return true
			}
			if (!user.id) return false
			// prevent the user from signing in if the email is not verified
			const existingUser = await getUserById(user.id)
			if (!existingUser?.emailVerified) return false
			// TODO: 2FA CHECK
			return true
		},
		// jwt callback returns the token and pass it to the session callback
		async jwt({ token }) {
			console.log('🚀 ~ callbacks jwt ~ { token }:', { token })
			// token.sub is the user id
			if (!token.sub) return token
			// check if the user exists in the database
			const existingUser = await getUserById(token.sub)
			if (!existingUser) return token
			// if the user exists then add the user role to the token
			token.role = existingUser.role as UserRole

			return token
		},
		async session({ token, session }) {
			console.log('🚀 ~ callbacks session ~ token:', { token })
			if (token.sub && session.user) {
				session.user.id = token.sub
			}
			if (token.role && session.user) {
				session.user.role = token.role as UserRole
			}
			return session
		},
	},
	...authConfig,
})
