'use server'
import { getErrorMessage } from '@/lib/utils'
import prisma from '@/lib/prisma'
import { SignUpSchema } from '@/schema/user'
import { encrypt } from 'encrypt'
import { z } from 'zod'
import { getUserByEmail } from '@/lib/actions/user.action'
import { genVerificationToken } from '@/lib/token'
import { sendVerificationEmail } from '@/lib/mail'

export const signUpUser = async (data: z.infer<typeof SignUpSchema>) => {
  try {
    const validateFields = SignUpSchema.safeParse(data)

    if (!validateFields.success) {
      return {
        errors: 'Invalid fields!'
      }
    }

    const { email, password, name } = validateFields.data

    const userAlreadyExists = await getUserByEmail(email)
    if (userAlreadyExists) {
      return {
        error: 'User with this email already exists!'
      }
    }

    const hashedPassword = await encrypt(password)
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })
    const vToken = await genVerificationToken(email)
    await sendVerificationEmail(vToken.email, vToken.token)
    return {
      message: 'Confirmation email sent! Please verify your email address.'
    }
  } catch (error) {
    return {
      error: getErrorMessage(error)
    }
  }
}
