'use server'
import { handleError } from '@/lib/utils'
import prisma from '@/prisma/client'

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
		handleError(error)
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
		handleError(error)
	}
}
