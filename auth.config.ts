import { getUserByEmail } from '@/lib/actions/user.action'
import { SignInSchema } from '@/schema/user'
import { compare } from 'encrypt'
import type { NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

export default {
	providers: [
		GitHub({
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
		}),
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		CredentialsProvider({
			async authorize(credentials) {
				const validateFields = SignInSchema.safeParse(credentials)

				if (validateFields.success) {
					const { email, password } = validateFields.data

					const hasRegisteredUser = await getUserByEmail(email)
					if (!hasRegisteredUser || !hasRegisteredUser.password) return null

					const passwordsMatch = await compare(password, hasRegisteredUser.password)
					if (passwordsMatch) return hasRegisteredUser
				}

				return null
			},
		}),
	],
} satisfies NextAuthConfig
