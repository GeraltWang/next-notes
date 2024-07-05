import { useSession } from 'next-auth/react'

/**
 * Get the current user role from the session
 * @abstract client only
 * @returns
 */
export const useCurrentRole = () => {
	const session = useSession()
	return session.data?.user
}
