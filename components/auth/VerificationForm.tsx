'use client'
import { useCallback, useEffect } from 'react'
import CardWrapper from '../CardWrapper'
import { BeatLoader } from 'react-spinners'
import { useSearchParams } from 'next/navigation'

const VerificationForm = () => {
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	const onSubmit = useCallback(() => {
		console.log(token)
	}, [token])

	useEffect(() => {
		onSubmit()
	}, [onSubmit])

	return (
		<CardWrapper headerLabel='Confirm your verification' backButtonLabel='Back to sign in' backButtonHref='/sign-in'>
			<div className='flex-center w-full'>
				<BeatLoader />
			</div>
		</CardWrapper>
	)
}

export default VerificationForm
