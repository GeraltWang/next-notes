'use client'
import React from 'react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import Header from '@/components/auth/Header'
import Social from '@/components/auth/Social'
import BackButton from '@/components/auth/BackButton'

interface Props {
	children?: React.ReactNode
	headerLabel: string
	backButtonLabel: string
	backButtonHref: string
	showSocial?: boolean
}

const CardWrapper = ({ children, headerLabel, backButtonLabel, backButtonHref, showSocial }: Props) => {
	return (
		<Card className='w-[400px] shadow-md'>
			<CardHeader>
				<Header label={headerLabel} />
			</CardHeader>
			{children && <CardContent>{children}</CardContent>}
			{showSocial && (
				<CardFooter>
					<Social />
				</CardFooter>
			)}
			<CardFooter>
				<BackButton label={backButtonLabel} href={backButtonHref} />
			</CardFooter>
		</Card>
	)
}

export default CardWrapper
