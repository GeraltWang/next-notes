import { getUserByEmail } from '@/lib/actions/user.action'
import { LoginSchema } from '@/schema/user'
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
			// name: '密码登录',
			// credentials: {
			// 	email: { label: 'Email', type: 'email', placeholder: 'Email' },
			// 	password: { label: 'Password', type: 'password', placeholder: 'Password' },
			// },
			async authorize(credentials) {
				const validateFields = LoginSchema.safeParse(credentials)

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
