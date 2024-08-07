'use client'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useTranslations } from 'next-intl'

import SignInButton from '@/components/auth/SignInButton'
import SignOutButton from '@/components/auth/SignOutButton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { RiAccountCircleLine, RiLogoutBoxRLine, RiUserSettingsLine } from 'react-icons/ri'

const UserButton = () => {
  const t = useTranslations('Auth')

  const user = useCurrentUser()

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger className='flex items-center gap-x-2'>
            <Avatar>
              <AvatarImage src={user?.image || ''} />
              <AvatarFallback className='bg-secondary'>
                <RiAccountCircleLine className='h-5 w-5' />
              </AvatarFallback>
            </Avatar>
            {/* <span className='text-sm'>{user?.name}</span> */}
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-40' align='end'>
            <DropdownMenuItem className='cursor-pointer'>
              <RiUserSettingsLine className='mr-2 h-4 w-4' />
              <Link className='flex-1 text-inherit' href={'/settings'}>
                个人中心
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <SignOutButton>
              <DropdownMenuItem className='cursor-pointer'>
                <RiLogoutBoxRLine className='mr-2 h-4 w-4' />
                {t('signOut')}
              </DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <SignInButton asChild>
          <Button size={'sm'}>{t('signIn')}</Button>
        </SignInButton>
      )}
    </>
  )
}

export default UserButton
