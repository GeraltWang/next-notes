'use server'
import prisma from '@/prisma/client'
import { currentUser } from '@/lib/auth'
// import { redirect } from 'next/navigation'
import { z } from 'zod'
import { ProfileSchema } from '@/schema/user'
import { getErrorMessage } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export const getUserByEmail = async (email: string) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				email: email,
			},
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
				id: id,
			},
		})

		if (user) {
			return user
		}

		return null
	} catch (error) {
		return null
	}
}
