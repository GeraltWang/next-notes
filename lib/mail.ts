import { Resend } from 'resend'
import { PASSWORD_RESET_ROOT, VERIFICATION_ROOT } from '@/routes'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationEmail = async (email: string, token: string) => {
	const confirmLink = `http://localhost:3000${VERIFICATION_ROOT}?token=${token}`

	await resend.emails.send({
		from: 'onboarding@resend.dev',
		to: email,
		subject: 'Confirm your email',
		html: `
      <p>click <a href="${confirmLink}">here</a> to confirm your email.</p>
    `,
	})
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
	const resetLink = `http://localhost:3000${PASSWORD_RESET_ROOT}?token=${token}`

	await resend.emails.send({
		from: 'onboarding@resend.dev',
		to: email,
		subject: 'Reset your password',
		html: `
      <p>click <a href="${resetLink}">here</a> to reset your password.</p>
    `,
	})
}
