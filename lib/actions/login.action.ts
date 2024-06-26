'use server'
import { handleError, handleAuthError } from '@/lib/utils'
import { AuthError } from 'next-auth'
import { LoginSchema } from '@/schema/user'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import * as z from 'zod'
import { signIn } from '@/auth'

export const loginUser = async (data: z.infer<typeof LoginSchema>) => {
	try {
		const validateFields = LoginSchema.safeParse(data)

		if (!validateFields.success) {
			return {
				errors: 'Invalid fields!',
			}
		}

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
