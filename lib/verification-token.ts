import { v4 as uuidV4 } from 'uuid'
import prisma from '@/prisma/client'
import { getVerificationToKenByEmail } from '@/lib/actions/verification-token.action'

export const genVerificationToken = async (email: string) => {
	const token = uuidV4()
	const expires = new Date(new Date().getTime() + 3600 * 1000)

	const existingToken = await getVerificationToKenByEmail(email)
	if (existingToken) {
		await prisma.verificationToken.delete({
			where: {
				id: existingToken.id,
			},
		})
	}

	const verificationToken = await prisma.verificationToken.create({
		data: {
			token,
			email,
			expires,
		},
	})

	return verificationToken
}
