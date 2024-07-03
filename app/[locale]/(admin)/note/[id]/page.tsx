import Note from '@/components/Note'
import { getNoteById } from '@/lib/actions/notes.action'
import { SearchParamProps } from '@/types'

const NoteDetailPage = async ({ params }: SearchParamProps) => {
	// 动态路由 获取笔记 id
	const noteId = params.id
	const note = await getNoteById(noteId)

	if (note == null) {
		return (
			<div className='note--empty-state'>
				<span className='note-text--empty-state'>Click a note on the left to view something! 🥺</span>
			</div>
		)
	}

	return <Note noteId={noteId} note={note} />
}

export default NoteDetailPage
