import dayjs from 'dayjs'
import NotePreview from '@/components/NotePreview'
import EditButton from '@/components/EditButton'
import { type Note } from '@/types'
import { useTranslations } from 'next-intl'

interface Props {
	noteId: string
	note: Note
}

const Note = ({ noteId, note }: Props) => {
	const t = useTranslations('Basic')
	const { title, content, updatedAt } = note

	return (
		<div className='note'>
			<div className='note-header'>
				<h1 className='note-title'>{title}</h1>
				<div className='note-menu' role='menubar'>
					<small className='note-updated-at' role='status'>
						Last updated on {updatedAt}
					</small>
					<EditButton noteId={noteId}>{t('edit')}</EditButton>
				</div>
			</div>
			<NotePreview>{content}</NotePreview>
		</div>
	)
}

export default Note
