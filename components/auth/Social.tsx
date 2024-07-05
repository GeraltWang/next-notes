'use client'
import React from 'react'
import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { useSearchParams } from 'next/navigation'

const Social = () => {
  const searchParams = useSearchParams()

  const callbackUrl = searchParams.get('callbackUrl')

  const handleSocial = (provider: 'google' | 'github') => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT
    })
  }

  return (
    <div className='flex w-full items-center gap-x-2'>
      <Button className='w-full' size={'lg'} variant={'outline'} onClick={() => handleSocial('google')}>
        <FcGoogle className='h-5 w-5' />
      </Button>
      <Button className='w-full' size={'lg'} variant={'outline'} onClick={() => handleSocial('github')}>
        <FaGithub className='h-5 w-5' />
      </Button>
    </div>
  )
}

export default Social
