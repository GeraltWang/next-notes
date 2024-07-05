import React from 'react'
import CardWrapper from '@/components/CardWrapper'

const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel='Oops something went wrong...'
      backButtonLabel='Back to sign in page'
      backButtonHref='/sign-in'
    />
  )
}

export default ErrorCard
