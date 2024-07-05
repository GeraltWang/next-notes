import { useSession } from 'next-auth/react'

/**
 * Get the current user from the session
 * @abstract client only
 * @returns
 */
export const useCurrentUser = () => {
  const session = useSession()
  return session.data?.user
}
