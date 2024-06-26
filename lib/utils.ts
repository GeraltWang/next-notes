import type { AuthError } from 'next-auth'

export const handleError = (error: unknown) => {
	console.error(error)
	throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
}

export const handleAuthError = (error: AuthError) => {
	switch (error.type) {
		case 'CredentialsSignin':
			return {
				error: 'Invalid credentials',
			}
		default:
			return {
				error: 'Something went wrong!',
			}
	}
}
