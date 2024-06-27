import type { AuthError } from 'next-auth'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

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
