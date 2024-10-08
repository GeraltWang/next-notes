import { Resend } from 'resend'
import { PASSWORD_RESET_ROUTE, VERIFICATION_ROUTE } from '@/routes'

const resend = new Resend(process.env.RESEND_API_KEY)

const domain = process.env.NEXT_PUBLIC_APP_URL

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}${VERIFICATION_ROUTE}?token=${token}`

  await resend.emails.send({
    from: 'onboarding <security@email.muycloud.cc>', // onboarding@resend.dev
    to: email,
    subject: 'Confirm your email',
    html: `
      <p>click <a href="${confirmLink}">here</a> to confirm your email.</p>
    `
  })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}${PASSWORD_RESET_ROUTE}?token=${token}`

  await resend.emails.send({
    from: 'Reset your password <security@email.muycloud.cc>', // onboarding@resend.dev
    to: email,
    subject: 'Reset your password',
    html: `
      <p>click <a href="${resetLink}">here</a> to reset your password.</p>
    `
  })
}

export const sendTwoFactorEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: 'Two factor confirmation <security@email.muycloud.cc>', // onboarding@resend.dev
    to: email,
    subject: '2FA code',
    html: `
      <p>Your 2FA code is: ${token}</p>
    `
  })
}
