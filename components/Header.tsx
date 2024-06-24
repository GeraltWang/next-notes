import React from 'react'
import { auth } from 'auth'
import Image from 'next/image'
import Link from 'next/link'
// import AuthProvider from './AuthProvider'
import Avatar from './Avatar'

const Header = async ({ children }: { children?: React.ReactNode }) => {
	const session = await auth()

	return (
		<header className='header'>
			<Link href={'/'} className='link--unstyled'>
				<section className='header-logo'>
					<Image src='/next.svg' width={64} height={20} alt='logo' role='presentation' />
					<strong>Next Notes</strong>
				</section>
			</Link>
			{/* <AuthProvider session={session}> */}
			<Avatar session={session} />
			{/* </AuthProvider> */}
		</header>
	)
}

export default Header
