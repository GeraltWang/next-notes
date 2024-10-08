import authConfig from '@/auth.config'
import { getTwoFactorConfirmationByUserId } from '@/lib/actions/two-factor-confirmation'
import { getUserById } from '@/lib/actions/user.action'
import { getAccountByUserId } from '@/lib/data/account'
import prisma from '@/lib/prisma'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { UserRole } from '@prisma/client'
import NextAuth, { type DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

export type ExtendedUser = {
  id: string
  role: UserRole
  isTwoFactorEnabled: boolean
  isOAuth: boolean
} & DefaultSession['user']

// extend the session to include the user id and role
declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    role?: UserRole
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/sign-in',
    error: '/error'
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          emailVerified: new Date()
        }
      })
    }
  },
  callbacks: {
    // signIn callback checks if the user exists and if the email is verified
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') {
        return true
      }
      if (!user.id) return false
      // prevent the user from signing in if the email is not verified
      const existingUser = await getUserById(user.id)
      if (!existingUser?.emailVerified) return false
      // if the user has two factor enabled then check if the two factor confirmation exists
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)
        if (!twoFactorConfirmation) return false
        await prisma.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id
          }
        })
      }
      return true
    },
    // jwt callback returns the token and pass it to the session callback
    async jwt({ token }) {
      // console.log('🚀 ~ callbacks jwt ~ { token }:', { token })
      // token.sub is the user id
      if (!token.sub) return token
      // check if the user exists in the database
      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token

      const existingAccount = await getAccountByUserId(existingUser.id)
      // if the user exists then add the user info to the token
      token.name = existingUser.name
      token.email = existingUser.email
      token.role = existingUser.role as UserRole
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
      token.isOAuth = !!existingAccount

      return token
    },
    async session({ token, session }) {
      console.log('🚀 ~ callbacks session ~ token:', { token })
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole
      }
      if (session.user) {
        session.user.name = token.name
        session.user.email = token.email as string
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
        session.user.isOAuth = token.isOAuth as boolean
      }
      return session
    }
  },
  ...authConfig
})
