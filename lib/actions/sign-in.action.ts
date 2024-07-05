'use server'
import { getTwoFactorConfirmationByUserId } from '@/lib/actions/two-factor-confirmation'
import { getTwoFactorTokenByEmail } from '@/lib/actions/two-factor-token'
import { getUserByEmail } from '@/lib/actions/user.action'
import { sendTwoFactorEmail, sendVerificationEmail } from '@/lib/mail'
import { genTwoFactorToken, genVerificationToken } from '@/lib/token'
import { handleAuthError } from '@/lib/utils'
import prisma from '@/prisma/client'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { SignInSchema } from '@/schema/user'
import { signIn } from 'auth'
import { AuthError } from 'next-auth'
import { z } from 'zod'

export const signInUser = async (data: z.infer<typeof SignInSchema>, callbackUrl?: string | null) => {
	const validateFields = SignInSchema.safeParse(data)

	if (!validateFields.success) {
		return {
			error: 'Invalid fields!',
		}
	}

	const { email, password, code } = validateFields.data

	const existingUser = await getUserByEmail(email)
	// 1. 检查用户是否存在
	if (!existingUser || !existingUser.email || !existingUser.password) {
		return {
			error: 'Invalid email or password!',
		}
	}
	// 2. 检查用户是否已验证邮箱
	if (!existingUser.emailVerified) {
		const vToken = await genVerificationToken(existingUser.email)
		await sendVerificationEmail(vToken.email, vToken.token)
		return {
			message: 'Confirmation email sent! Please verify your email address.',
		}
	}
	// 3. 检查用户是否开启了两步验证
	if (existingUser.isTwoFactorEnabled && existingUser.email) {
		// 3.1 如果用户输入了两步验证的 code
		if (code) {
			// 3.1.1 检查 code 是否存在
			const existingToken = await getTwoFactorTokenByEmail(existingUser.email)
			if (!existingToken) {
				return {
					error: 'Invalid two-factor code!',
				}
			}
			// 3.1.2 检查 code 是否正确
			if (existingToken.token !== code) {
				return {
					error: 'Invalid two-factor code!',
				}
			}
			// 3.1.3 检查 code 是否过期
			const hasExpired = new Date() > new Date(existingToken.expires)
			if (hasExpired) {
				return {
					error: 'Two-factor code has expired!',
				}
			}
			// 3.1.4 删除 code
			await prisma.twoFactorToken.delete({
				where: {
					id: existingToken.id,
				},
			})
			// 3.1.5 如果用户已经有了两步验证的确认记录，删除记录，然后创建新的记录
			const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)
			if (existingConfirmation) {
				await prisma.twoFactorConfirmation.delete({
					where: {
						id: existingConfirmation.id,
					},
				})
			}
			await prisma.twoFactorConfirmation.create({
				data: {
					userId: existingUser.id,
				},
			})
		} else {
			// 3.2 如果用户没有输入两步验证的 code，发送2fa邮件 并返回 twoFactor: true
			const twoFactorToken = await genTwoFactorToken(existingUser.email)
			await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token)
			return {
				twoFactor: true,
			}
		}
	}
	// 4. 登录用户
	try {
		await signIn('credentials', {
			email,
			password,
			redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
		})
		return {
			message: 'Sign in successfully!',
		}
	} catch (error) {
		console.log('🚀 ~ signInUser ~ error:', error)
		if (error instanceof AuthError) {
			return handleAuthError(error)
		}
		throw error
	}
}
