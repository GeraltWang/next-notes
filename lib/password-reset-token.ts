import { v4 as uuidV4 } from 'uuid'
import prisma from '@/prisma/client'
import { getPasswordResetToKenByEmail } from '@/lib/actions/password-reset-token.action'

export const genPasswordResetToken = async (email: string) => {
	const token = uuidV4()
	const expires = new Date(new Date().getTime() + 3600 * 1000)

	const existingToken = await getPasswordResetToKenByEmail(email)
	if (existingToken) {
		await prisma.passwordResetToken.delete({
			where: {
				id: existingToken.id,
			},
		})
	}

	const passwordResetToken = await prisma.passwordResetToken.create({
		data: {
			token,
			email,
			expires,
		},
	})

	return passwordResetToken
}
