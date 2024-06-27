import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import { getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
}

export default async function RootLayout({
	children,
	params: { locale },
}: Readonly<{
	children: React.ReactNode
	params: { locale: string }
}>) {
	const messages = await getMessages()

	return (
		<html lang={locale}>
			<body className={inter.className}>
				<NextIntlClientProvider messages={messages}>
					<div className='w-full h-screen flex flex-col'>
						<Header />
						<div className='main'>
							<Sidebar />
							<section className='h-full w-full flex justify-center items-center'>{children}</section>
						</div>
					</div>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}