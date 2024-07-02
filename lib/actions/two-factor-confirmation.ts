import prisma from '@/prisma/client'

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
	try {
		const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
			where: {
				userId,
			},
		})
		return twoFactorConfirmation
	} catch (error) {
		return null
	}
}
