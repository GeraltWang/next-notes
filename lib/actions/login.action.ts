'use server'
import { handleAuthError, handleError } from '@/lib/utils'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { LoginSchema } from '@/schema/user'
import { signIn } from 'auth'
import { AuthError } from 'next-auth'
import { z } from 'zod'

export const loginUser = async (data: z.infer<typeof LoginSchema>) => {
	try {
		const validateFields = LoginSchema.safeParse(data)

		if (!validateFields.success) {
			return {
				error: 'Invalid fields!',
			}
		}
		// return {
		// 	message: 'Email Sent!',
		// }
		const { email, password } = validateFields.data
		await signIn('credentials', {
			email,
			password,
			redirectTo: DEFAULT_LOGIN_REDIRECT,
		})
	} catch (error) {
		if (error instanceof AuthError) {
			handleAuthError(error)
		}
		handleError(error)
	}
}
