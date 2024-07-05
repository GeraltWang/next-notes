import { auth } from 'auth'

/**
 * Get the current user from the session
 * @abstract server only
 * @returns
 */
export const currentUser = async () => {
	const session = await auth()
	return session?.user
}

/**
 * Get the current user role from the session
 * @abstract server only
 * @returns
 */
export const currentRole = async () => {
	const session = await auth()
	return session?.user.role
}
