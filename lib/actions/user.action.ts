'use server'
import { handleError } from '@/lib/utils'
import prisma from '@/prisma/client'
import { RegisterSchema } from '@/schema/user'
import bcrypt from 'bcryptjs'
import * as z from 'zod'

export const getUserByEmail = async (email: string) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				email: email,
			},
		})

		if (user) {
			return user
		}

		return null
	} catch (error) {
		handleError(error)
	}
}

export const getUserById = async (id: string) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: id,
			},
		})

		if (user) {
			return user
		}

		return null
	} catch (error) {
		handleError(error)
	}
}

export const registerUser = async (data: z.infer<typeof RegisterSchema>) => {
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
				errors: 'User with this email already exists!',
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
		return {
			message: 'User registered successfully!',
		}
	} catch (error) {
		handleError(error)
	}
}
