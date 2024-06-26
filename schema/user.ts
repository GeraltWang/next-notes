import { z } from 'zod'

export const LoginSchema = z.object({
	email: z
		.string()
		.min(1, {
			message: 'Email is required',
		})
		.email({
			message: 'Invalid email address',
		}),
	password: z.string().min(1, {
		message: 'Password is required',
	}),
})

export const RegisterSchema = z.object({
	email: z
		.string()
		.min(1, {
			message: 'Email is required',
		})
		.email({
			message: 'Invalid email address',
		}),
	password: z.string().min(6),
	name: z.string().min(3),
})
