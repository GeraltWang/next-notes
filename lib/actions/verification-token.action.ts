'use server'
import prisma from '@/prisma/client'
import { getErrorMessage } from '@/lib/utils'

export const getVerificationToKenByToken = async (token: string) => {
	try {
		const vToken = await prisma.verificationToken.findUnique({
			where: {
				token,
			},
		})
		return vToken
	} catch (error) {
		return {
			error: getErrorMessage(error),
		}
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
		return {
			error: getErrorMessage(error),
		}
	}
}
