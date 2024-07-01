'use server'
import prisma from '@/prisma/client'
import { getErrorMessage } from '@/lib/utils'

export const getPasswordResetTokenByToken = async (token: string) => {
	try {
		const rToken = await prisma.passwordResetToken.findUnique({
			where: {
				token,
			},
		})
		return rToken
	} catch (error) {
		return {
			error: getErrorMessage(error),
		}
	}
}

export const getPasswordResetToKenByEmail = async (email: string) => {
	try {
		const vToken = await prisma.passwordResetToken.findFirst({
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
