'use server'
import { SIGN_IN_ROUTE } from '@/routes'
import { signOut } from 'auth'

export const signOutAction = async () => {
	await signOut({
		redirectTo: SIGN_IN_ROUTE,
		redirect: true,
	})
}
