'use server'
import { handleAuthError, handleError } from '@/lib/utils'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { LoginSchema } from '@/schema/user'
import { signIn } from 'auth'
import { AuthError } from 'next-auth'
import { z } from 'zod'
import { genVerificationToken } from '@/lib/verification-token'
import { getUserByEmail } from '@/lib/actions/user.action'
import { sendVerificationEmail } from '@/lib/mail'

export const signInUser = async (data: z.infer<typeof LoginSchema>) => {
	const validateFields = LoginSchema.safeParse(data)

	if (!validateFields.success) {
		return {
			error: 'Invalid fields!',
		}
	}

	const { email, password } = validateFields.data

	const existingUser = await getUserByEmail(email)

	if (!existingUser || !existingUser.email || !existingUser.password) {
		return {
			error: 'Invalid email or password!',
		}
	}

	if (!existingUser.emailVerified) {
		const vToken = await genVerificationToken(existingUser.email)
		await sendVerificationEmail(vToken.email, vToken.token)
		return {
			message: 'Confirmation email sent! Please verify your email address.',
		}
	}

	try {
		await signIn('credentials', {
			email,
			password,
			redirectTo: DEFAULT_LOGIN_REDIRECT,
		})
		return {
			message: 'Sign in successfully!',
		}
	} catch (error) {
		if (error instanceof AuthError) {
			return handleAuthError(error)
		}
		throw error
		// throw handleError(error)
	}
}
