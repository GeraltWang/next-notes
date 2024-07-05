import { type Note } from '@/types'
import SidebarNoteItemContent from './SidebarNoteItemContent'
import SidebarNoteItemHeader from './SidebarNoteItemHeader'

interface Props {
  noteId: string
  note: Note
}

const SidebarNoteItem = ({ noteId, note }: Props) => {
  const { title, content = '', updatedAt } = note
  return (
    <SidebarNoteItemContent
      id={noteId}
      title={note.title}
      expandedChildren={<p className='sidebar-note-excerpt'>{content.substring(0, 20) || <i>(No content)</i>}</p>}
    >
      <SidebarNoteItemHeader title={title} updateTime={updatedAt} />
    </SidebarNoteItemContent>
  )
}

export default SidebarNoteItem
