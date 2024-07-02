import type { AuthError } from 'next-auth'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const getErrorMessage = (error: unknown) => {
	let message: string
	if (error instanceof Error) {
		message = error.message
	} else if (error && typeof error === 'object' && 'message' in error) {
		message = String(error.message)
	} else if (typeof error === 'string') {
		message = error
	} else {
		message = 'Something went wrong!'
	}
}

export const handleError = (error: unknown) => {
	console.error(error)
	throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
}

export const handleAuthError = (error: AuthError) => {
	console.log('🚀 ~ handleAuthError ~ error:', JSON.stringify(error))
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

/**
 * 生成过期时间的函数
 * @param durationInMinutes 过期时长，以分钟为单位
 * @returns 返回一个表示过期时间的Date对象
 */
export const generateExpiryTime = (durationInMinutes: number): Date => {
	const now = new Date()
	const expiryTime = new Date(now.getTime() + durationInMinutes * 60000) // 60000毫秒等于1分钟
	return expiryTime
}
