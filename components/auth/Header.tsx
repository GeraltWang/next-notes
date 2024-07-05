import React from 'react'
import { Poppins } from 'next/font/google'
import { cn } from '@/lib/utils'

const font = Poppins({
  subsets: ['latin'],
  weight: ['600']
})

interface Props {
  label: string
}

const Header = ({ label }: Props) => {
  return (
    <div className='flex-center w-full flex-col gap-y-4'>
      <h1 className={cn('text-3xl font-semibold', font.className)}>Auth</h1>
      <p className='text-sm text-muted-foreground'>{label}</p>
    </div>
  )
}

export default Header
