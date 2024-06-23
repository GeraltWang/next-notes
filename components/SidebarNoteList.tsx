import { getAllNotes } from '@/lib/redis'
import SidebarNoteItemHeader from './SidebarNoteItemHeader'
import SidebarNoteListFilter from './SidebarNoteListFilter'

const SidebarNoteList = async () => {
	const notes = await getAllNotes()

	if (notes.length == 0) {
		return <div className='notes-empty'>{'No notes created yet!'}</div>
	}

	return (
		<SidebarNoteListFilter
			notes={notes.map(note => {
				return {
					...note,
					header: <SidebarNoteItemHeader title={note.title} updateTime={note.updateTime} />,
				}
			})}
		/>
	)
}

export default SidebarNoteList
