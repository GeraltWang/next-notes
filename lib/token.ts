import { v4 as uuidV4 } from 'uuid'
import prisma from '@/prisma/client'
import { getVerificationToKenByEmail } from '@/lib/actions/verification-token.action'
import { getPasswordResetToKenByEmail } from '@/lib/actions/password-reset-token.action'

/**
 * 生成账户激活邮件 token
 * @param email
 * @returns
 */
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

/**
 * 生成密码重置邮件 token
 * @param email
 * @returns
 */
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
