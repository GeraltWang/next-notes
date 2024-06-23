'use client'

import { useSearchParams } from 'next/navigation'
import SidebarNoteItemContent from '@/components/SidebarNoteItemContent'
import { Note } from '@/types'

type NoteWithHeader = Note & { header: React.ReactNode }

interface Props {
	notes: NoteWithHeader[]
}

export default function SidebarNoteList({ notes }: Props) {
	const searchParams = useSearchParams()
	const searchText = searchParams.get('q')
	return (
		<ul className='notes-list'>
			{notes.map(noteItem => {
				const { noteId, title, content, header } = noteItem
				if (!searchText || (searchText && title.toLowerCase().includes(searchText.toLowerCase()))) {
					return (
						<li key={noteId}>
							<SidebarNoteItemContent
								key={noteId}
								id={noteId}
								title={title}
								expandedChildren={
									<p className='sidebar-note-excerpt'>{content.substring(0, 20) || <i>(No content)</i>}</p>
								}
							>
								{header}
							</SidebarNoteItemContent>
						</li>
					)
				}

				return null
			})}
		</ul>
	)
}
