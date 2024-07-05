'use server'
import prisma from '@/prisma/client'
import { currentUser } from '@/lib/auth'
import { ProfileSchema, SecuritySchema } from '@/schema/user'
import { z } from 'zod'
import { getUserById } from './user.action'
import { getErrorMessage } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { encrypt, compare } from '@/lib/encrypt'

export const updateUserName = async (values: z.infer<typeof ProfileSchema>) => {
  const validatedFields = ProfileSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: 'Invalid data!'
    }
  }
  const { name } = validatedFields.data
  try {
    const user = await currentUser()
    if (!user) {
      return {
        error: 'User unauthorized!'
      }
    }

    const existingUser = await getUserById(user.id)
    if (!existingUser) {
      return {
        error: 'User not found!'
      }
    }

    await prisma.user.update({
      where: {
        id: existingUser.id
      },
      data: {
        name
      }
    })

    revalidatePath('/', 'layout')

    return {
      message: 'User updated!'
    }
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const updateUserSecurity = async (values: z.infer<typeof SecuritySchema>) => {
  const user = await currentUser()

  if (!user) {
    return {
      error: 'User unauthorized!'
    }
  }

  const validatedFields = SecuritySchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: 'Invalid data!'
    }
  }

  const { isTwoFactorEnabled, password, newPassword } = validatedFields.data

  const existingUser = await getUserById(user.id)
  if (!existingUser) {
    return {
      error: 'User not found!'
    }
  }
  // 如果是OAuth用户，需要把两步验证和密码字段置空，这些字段不适用于OAuth用户
  if (user.isOAuth) {
    values.isTwoFactorEnabled = undefined
    values.password = undefined
    values.newPassword = undefined
  }
  // 更改密码逻辑
  if (password && newPassword && existingUser.password) {
    const passwordsMatch = await compare(password, existingUser.password)

    if (!passwordsMatch) {
      return {
        error: 'Incorrect password!'
      }
    }

    const hashedNewPassword = await encrypt(newPassword)

    await prisma.user.update({
      where: {
        id: existingUser.id
      },
      data: {
        password: hashedNewPassword
      }
    })

    return {
      message: 'User security feature updated!'
    }
  }
}
