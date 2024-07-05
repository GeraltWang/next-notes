'use client'
import { SIGN_IN_ROUTE } from '@/routes'
import { useRouter } from 'next/navigation'

import SignInForm from '@/components/auth/SignInForm'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

interface Props {
	children: React.ReactNode
	mode?: 'modal' | 'redirect'
	asChild?: boolean
}

const SignInButton = ({ children, mode = 'redirect', asChild }: Props) => {
	const router = useRouter()

	const onClick = () => {
		router.push(SIGN_IN_ROUTE)
	}

	if (mode === 'modal') {
		return (
			<Dialog>
				<DialogTrigger asChild={asChild}>{children}</DialogTrigger>
				<DialogContent className='p-0 w-auto bg-transparent border-none'>
					<SignInForm />
				</DialogContent>
			</Dialog>
		)
	}
	return (
		<span className='cursor-pointer' onClick={onClick}>
			{children}
		</span>
	)
}

export default SignInButton
