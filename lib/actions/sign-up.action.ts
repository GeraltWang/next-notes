'use server'
import { handleError } from '@/lib/utils'
import prisma from '@/prisma/client'
import { RegisterSchema } from '@/schema/user'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { getUserByEmail } from '@/lib/actions/user.action'
import { genVerificationToken } from '@/lib/verification-token'
import { sendVerificationEmail } from '@/lib/mail'

export const signUpUser = async (data: z.infer<typeof RegisterSchema>) => {
	try {
		const validateFields = RegisterSchema.safeParse(data)

		if (!validateFields.success) {
			return {
				errors: 'Invalid fields!',
			}
		}

		const { email, password, name } = validateFields.data

		const userAlreadyExists = await getUserByEmail(email)
		if (userAlreadyExists) {
			return {
				error: 'User with this email already exists!',
			}
		}

		const hashedPassword = await bcrypt.hash(password, 10)
		await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		})
		const vToken = await genVerificationToken(email)
		await sendVerificationEmail(vToken.email, vToken.token)
		return {
			message: 'Confirmation email sent! Please verify your email address.',
		}
	} catch (error) {
		handleError(error)
	}
}
