'use server'
import prisma from '@/lib/prisma'

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    if (user) {
      return user
    }

    return null
  } catch (error) {
    return null
  }
}

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id
      }
    })

    if (user) {
      return user
    }

    return null
  } catch (error) {
    return null
  }
}
