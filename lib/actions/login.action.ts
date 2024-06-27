'use server'
import { handleAuthError, handleError } from '@/lib/utils'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { LoginSchema } from '@/schema/user'
import { signIn } from 'auth'
import { AuthError } from 'next-auth'
import { z } from 'zod'

export const loginUser = async (data: z.infer<typeof LoginSchema>) => {
	const validateFields = LoginSchema.safeParse(data)

	if (!validateFields.success) {
		return {
			error: 'Invalid fields!',
		}
	}

	const { email, password } = validateFields.data

	try {
		await signIn('credentials', {
			email,
			password,
			redirectTo: DEFAULT_LOGIN_REDIRECT,
		})
	} catch (error) {
		if (error instanceof AuthError) {
			return handleAuthError(error)
		}
		throw error
		// throw handleError(error)
	}
}
