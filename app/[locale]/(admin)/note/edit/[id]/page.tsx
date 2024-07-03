import NoteEditor from '@/components/NoteEditor'
import { getNoteById } from '@/lib/actions/notes.action'
import { SearchParamProps } from '@/types'

const NoteEditPage = async ({ params }: SearchParamProps) => {
	const noteId = params.id
	const note = await getNoteById(noteId)

	if (note === null) {
		return (
			<div className='note--empty-state'>
				<span className='note-text--empty-state'>Click a note on the left to view something! 🥺</span>
			</div>
		)
	}

	return <NoteEditor noteId={noteId} initialTitle={note.title} initialBody={note.content} />
}

export default NoteEditPage
