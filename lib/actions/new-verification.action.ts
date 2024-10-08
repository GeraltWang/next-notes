'use server'
import prisma from '@/lib/prisma'
import { getErrorMessage } from '@/lib/utils'
import { getUserByEmail } from '@/lib/actions/user.action'
import { getVerificationToKenByToken } from '@/lib/actions/verification-token.action'

/**
 * Verify user email
 */
export const newVerification = async (token: string) => {
  try {
    const existingToken = await getVerificationToKenByToken(token)

    if (!existingToken) {
      return {
        error: 'Token does not exist!'
      }
    }

    const hasExpired = new Date(existingToken.expires) < new Date()

    if (hasExpired) {
      return {
        error: 'Token has expired!'
      }
    }

    const existingUser = await getUserByEmail(existingToken.email)

    if (!existingUser) {
      return {
        error: 'User with this email does not exist!'
      }
    }

    await prisma.user.update({
      where: {
        id: existingUser.id
      },
      data: {
        emailVerified: new Date(),
        email: existingToken.email
      }
    })

    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id
      }
    })

    return {
      message: 'Email verified!'
    }
  } catch (error) {
    return {
      error: getErrorMessage(error)
    }
  }
}
