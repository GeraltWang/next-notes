import { getUserByEmail } from '@/lib/actions/user.action'
import { LoginSchema } from '@/schema/user'
import bcrypt from 'bcryptjs'
import type { NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'

export default {
	providers: [
		GitHub,
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

					const passwordsMatch = await bcrypt.compare(password, hasRegisteredUser.password)
					if (passwordsMatch) return hasRegisteredUser
				}

				return null
			},
		}),
	],
} satisfies NextAuthConfig
