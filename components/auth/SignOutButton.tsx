'use client'
import { signOutAction } from '@/lib/actions/sign-out'

interface Props {
  children?: React.ReactNode
}

const SignOutButton = ({ children }: Props) => {
  const onClick = () => {
    signOutAction()
  }
  return (
    <span className='cursor-pointer' onClick={onClick}>
      {children}
    </span>
  )
}

export default SignOutButton
