'use server'
import { getPasswordResetTokenByToken } from '@/lib/actions/password-reset-token.action'
import { getUserByEmail } from '@/lib/actions/user.action'
import { handleError } from '@/lib/utils'
import prisma from '@/prisma/client'
import { ResetPasswordSchema } from '@/schema/user'
import { encrypt } from 'encrypt'
import { z } from 'zod'

export const newPassword = async (values: z.infer<typeof ResetPasswordSchema>, token: string | null) => {
	try {
		// 1. 确保有 token
		if (!token) {
			return {
				error: 'Missing token!',
			}
		}
		// 2. 验证新密码合法性
		const validatedFields = ResetPasswordSchema.safeParse(values)
		if (!validatedFields.success) {
			return {
				error: 'Invalid password!',
			}
		}
		// 3. 确保 token 在数据库中
		const existingToken = await getPasswordResetTokenByToken(token)
		if (!existingToken) {
			return {
				error: 'Token does not exist!',
			}
		}
		// 4. 确保 token 未过期
		const hasExpired = new Date(existingToken.expires) < new Date()
		if (hasExpired) {
			return {
				error: 'Token has expired!',
			}
		}
		// 5. 确保被重置密码的用户存在
		const existingUser = await getUserByEmail(existingToken.email)
		if (!existingUser) {
			return {
				error: 'User with this email does not exist!',
			}
		}
		// 6. 更新密码
		const { password } = validatedFields.data
		const hashedNewPassword = await encrypt(password)
		await prisma.user.update({
			where: {
				id: existingUser.id,
			},
			data: {
				password: hashedNewPassword,
			},
		})
		// 7. 删除 token
		await prisma.passwordResetToken.delete({
			where: {
				id: existingToken.id,
			},
		})
		return {
			message: 'Password updated!',
		}
	} catch (error) {
		handleError(error)
	}
}
