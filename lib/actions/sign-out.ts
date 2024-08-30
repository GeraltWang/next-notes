'use server'
import { SIGN_IN_ROUTE } from '@/routes'
import { signOut } from 'auth'
import { redirect } from '@/routing'

export const signOutAction = async () => {
  await signOut({
    // redirectTo: SIGN_IN_ROUTE,
    redirect: false
  })
  redirect(SIGN_IN_ROUTE)
}
