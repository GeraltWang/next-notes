'use client'
import React, { ReactNode } from 'react'
import { SessionProvider, SessionProviderProps } from 'next-auth/react'

const AuthProvider = ({ session, children }: { session: SessionProviderProps['session']; children: ReactNode }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>
}

export default AuthProvider
