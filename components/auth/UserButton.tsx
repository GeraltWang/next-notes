'use client'
import SignOutButton from '@/components/auth/SignOutButton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useCurrentUser } from '@/hooks/use-current-user'
import { LogOut } from 'lucide-react'
import { FaUser } from 'react-icons/fa'

const UserButton = () => {
	const user = useCurrentUser()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className='flex items-center gap-x-2'>
				<Avatar>
					<AvatarImage src={user?.image || ''} />
					<AvatarFallback className='bg-secondary'>
						<FaUser className='text-zinc-600' />
					</AvatarFallback>
				</Avatar>
				<span className='text-sm'>{user?.name}</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-40' align='end'>
				<SignOutButton>
					<DropdownMenuItem>
						<LogOut className='w-4 h-4 mr-2' />
						Sign out
					</DropdownMenuItem>
				</SignOutButton>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default UserButton
