'use server'
import prisma from '@/prisma/client'
import { handleError } from '@/lib/utils'

export const getVerificationToKenByToken = async (token: string) => {
	try {
		const vToken = await prisma.verificationToken.findUnique({
			where: {
				token,
			},
		})
		return vToken
	} catch (error) {
		handleError(error)
	}
}

export const getVerificationToKenByEmail = async (email: string) => {
	try {
		const vToken = await prisma.verificationToken.findFirst({
			where: {
				email,
			},
		})
		return vToken
	} catch (error) {
		handleError(error)
	}
}
