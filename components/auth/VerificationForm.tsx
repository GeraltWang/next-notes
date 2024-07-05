'use client'
import CardWrapper from '@/components/CardWrapper'
import FormError from '@/components/auth/FormError'
import FormSuccess from '@/components/auth/FormSuccess'
import { newVerification } from '@/lib/actions/new-verification.action'
import { SIGN_IN_ROUTE } from '@/routes'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'

const VerificationForm = () => {
  const t = useTranslations('Auth')
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
      .then((data) => {
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
    <CardWrapper
      headerLabel='Confirm your verification'
      backButtonLabel={t('backToSignIn')}
      backButtonHref={SIGN_IN_ROUTE}
    >
      <div className='flex-center w-full'>
        {!success && !error && <BeatLoader />}
        {!success && <FormError message={error} />}
        {!error && <FormSuccess message={success} />}
      </div>
    </CardWrapper>
  )
}

export default VerificationForm
