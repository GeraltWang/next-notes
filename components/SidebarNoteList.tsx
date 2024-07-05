import { getNotes } from '@/lib/actions/notes.action'
import SidebarNoteItemHeader from './SidebarNoteItemHeader'
import SidebarNoteListFilter from './SidebarNoteListFilter'

const SidebarNoteList = async () => {
  const notes = await getNotes()

  if (!Array.isArray(notes) || notes?.length == 0) {
    return <div className='notes-empty'>{'No notes created yet!'}</div>
  }

  return (
    <SidebarNoteListFilter
      notes={notes?.map((note) => {
        return {
          ...note,
          header: <SidebarNoteItemHeader title={note.title} updateTime={note.updatedAt} />
        }
      })}
    />
  )
}

export default SidebarNoteList
