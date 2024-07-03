import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button'

interface Props {
	noteId: string | null
	children: React.ReactNode
}

const EditButton = ({ noteId, children }: Props) => {
	const isDraft = noteId == null
	return (
		<Button size={'sm'} asChild>
			<Link href={`/note/edit/${noteId || ''}`} className='link--unstyled'>
				{children}
			</Link>
		</Button>
	)
}

export default EditButton
