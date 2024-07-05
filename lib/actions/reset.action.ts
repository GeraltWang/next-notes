'use server'
import { z } from 'zod'
import { ResetSchema } from '@/schema/user'
import { getUserByEmail } from '@/lib/actions/user.action'
import { sendPasswordResetEmail } from '@/lib/mail'
import { genPasswordResetToken } from '@/lib/token'

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: 'Invalid email!'
    }
  }

  const { email } = validatedFields.data

  const existingUser = await getUserByEmail(email)
  if (!existingUser) {
    return {
      error: 'Email not found!'
    }
  }
  const rToken = await genPasswordResetToken(email)
  await sendPasswordResetEmail(rToken.email, rToken.token)
  return {
    message: 'Password reset email sent!'
  }
}
