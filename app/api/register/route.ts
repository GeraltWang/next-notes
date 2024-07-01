import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/client'
import schema from './schema'
import { encrypt } from 'encrypt'

export async function POST(request: NextRequest) {
	const body = await request.json()

	const validation = schema.safeParse(body)
	if (!validation.success) {
		return NextResponse.json(validation.error.errors, { status: 400 })
	}
	const user = await prisma.user?.findUnique({
		where: {
			email: validation.data.email,
		},
	})

	if (user) {
		return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
	}

	const hashedPassword = await encrypt(validation.data.password, 10)

	const newUser = await prisma.user.create({
		data: {
			email: validation.data.email,
			password: hashedPassword,
		},
	})

	return NextResponse.json({ message: 'success', data: newUser }, { status: 200 })
}
