'use client'
import { useCallback, useEffect, useState } from 'react'
import CardWrapper from '@/components/CardWrapper'
import FormError from '@/components/auth/FormError'
import FormSuccess from '@/components/auth/FormSuccess'
import { BeatLoader } from 'react-spinners'
import { useSearchParams } from 'next/navigation'
import { newVerification } from '@/lib/actions/new-verification.action'

const VerificationForm = () => {
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	const [error, setError] = useState<string | undefined>('')

	const [success, setSuccess] = useState<string | undefined>('')

	const onSubmit = useCallback(() => {
		if (success || error) {
			return
		}

		if (!token) {
			setError('Missing token')
			return
		}

		newVerification(token)
			.then(data => {
				data?.error && setError(data.error)
				data?.message && setSuccess(data.message)
			})
			.catch(() => {
				setError('An error occurred')
			})
	}, [success, error, token])

	useEffect(() => {
		onSubmit()
	}, [onSubmit])

	return (
		<CardWrapper headerLabel='Confirm your verification' backButtonLabel='Back to sign in' backButtonHref='/sign-in'>
			<div className='flex-center w-full'>
				{!success && !error && <BeatLoader />}
				{!success && <FormError message={error} />}
				{!error && <FormSuccess message={success} />}
			</div>
		</CardWrapper>
	)
}

export default VerificationForm
