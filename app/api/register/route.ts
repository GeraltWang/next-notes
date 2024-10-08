import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { SignUpSchema } from '@/schema/user'
import { encrypt } from 'encrypt'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const validation = SignUpSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 })
  }

  const { name, email, password } = validation.data

  const user = await prisma.user?.findUnique({
    where: {
      email
    }
  })

  if (user) {
    return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
  }

  const hashedPassword = await encrypt(password)

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  return NextResponse.json({ message: 'success', data: newUser }, { status: 200 })
}
