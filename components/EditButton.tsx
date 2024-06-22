import Link from 'next/link'
import React from 'react'

interface Props {
	noteId: string | null
	children: React.ReactNode
}

const EditButton = ({ noteId, children }: Props) => {
	const isDraft = noteId == null
	return (
		<Link href={`/note/edit/${noteId || ''}`} className='link--unstyled'>
			<button
				className={['edit-button', isDraft ? 'edit-button--solid' : 'edit-button--outline'].join(' ')}
				role='menuitem'
			>
				{children}
			</button>
		</Link>
	)
}

export default EditButton
