'use server'
import prisma from '@/lib/prisma'

export const getVerificationToKenByToken = async (token: string) => {
  try {
    const vToken = await prisma.verificationToken.findUnique({
      where: {
        token
      }
    })
    return vToken
  } catch (error) {
    return null
  }
}

export const getVerificationToKenByEmail = async (email: string) => {
  try {
    const vToken = await prisma.verificationToken.findFirst({
      where: {
        email
      }
    })
    return vToken
  } catch (error) {
    return null
  }
}
