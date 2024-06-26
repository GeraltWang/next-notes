import React from 'react'
import Image from 'next/image'
import { SessionProviderProps } from 'next-auth/react'
import { signIn, signOut, auth } from 'auth'

interface SignInProps {
	provider?: string
}

function SignIn({ provider, ...props }: SignInProps) {
	return (
		<form
			action={async () => {
				'use server'
				await signIn(provider)
			}}
		>
			<button {...props}>Sign In</button>
		</form>
	)
}

interface SignOutProps {
	[key: string]: any
}

function SignOut(props: SignOutProps) {
	return (
		<form
			action={async () => {
				'use server'
				await signOut({ redirectTo: '/' })
			}}
		>
			<button {...props}>Sign Out</button>
		</form>
	)
}

const Avatar = ({ session }: { session: SessionProviderProps['session'] }) => {
	return (
		<>
			{session?.user ? (
				<span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
					<Image src={session.user?.image || ''} width={30} height={30} alt='avatar' />
					{session?.user.name}
					<SignOut />
				</span>
			) : (
				<SignIn />
			)}
		</>
	)
}

export default Avatar
