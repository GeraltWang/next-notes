import { getAllNotes } from '@/lib/redis'
import SidebarNoteItem from './SidebarNoteItem'
import { type Note } from '@/types'

const SidebarNoteList = async () => {
	const notes = await getAllNotes()

	const arr = Object.entries(notes)

	if (arr.length == 0) {
		return <div className='notes-empty'>{'No notes created yet!'}</div>
	}

	return (
		<ul className='notes-list'>
			{arr.map(([noteId, note]) => {
				const noteFromJson: Note = JSON.parse(note)
				return (
					<li key={noteId}>
						<SidebarNoteItem noteId={noteId} note={noteFromJson} />
					</li>
				)
			})}
		</ul>
	)
}

export default SidebarNoteList
