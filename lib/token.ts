import { getPasswordResetToKenByEmail } from '@/lib/actions/password-reset-token.action'
import { getTwoFactorTokenByEmail } from '@/lib/actions/two-factor-token'
import { getVerificationToKenByEmail } from '@/lib/actions/verification-token.action'
import { generateExpiryTime } from '@/lib/utils'
import prisma from '@/lib/prisma'
import crypto from 'crypto'
import { v4 as uuidV4 } from 'uuid'

/**
 * 生成账户激活邮件 token
 * @param email
 * @returns
 */
export const genVerificationToken = async (email: string) => {
  const token = uuidV4()
  const expires = generateExpiryTime(60)

  const existingToken = await getVerificationToKenByEmail(email)
  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id
      }
    })
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      token,
      email,
      expires
    }
  })

  return verificationToken
}

/**
 * 生成密码重置邮件 token
 * @param email
 * @returns
 */
export const genPasswordResetToken = async (email: string) => {
  const token = uuidV4()
  const expires = generateExpiryTime(60)

  const existingToken = await getPasswordResetToKenByEmail(email)
  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: {
        id: existingToken.id
      }
    })
  }

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      token,
      email,
      expires
    }
  })

  return passwordResetToken
}

/**
 * 生成两步验证 token
 * @param email
 */
export const genTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100000, 1000000).toString()
  const expires = generateExpiryTime(5)

  const existingToken = await getTwoFactorTokenByEmail(email)
  if (existingToken) {
    await prisma.twoFactorToken.delete({
      where: {
        id: existingToken.id
      }
    })
  }

  const twoFactorToken = await prisma.twoFactorToken.create({
    data: {
      token,
      email,
      expires
    }
  })

  return twoFactorToken
}
