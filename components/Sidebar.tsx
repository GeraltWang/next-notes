import React, { Suspense } from 'react'
import SidebarNoteList from '@/components/SidebarNoteList'
import EditButton from './EditButton'
import NoteListSkeleton from './NoteListSkeleton'
import SidebarSearchField from './SidebarSearchField'
import { useTranslations } from 'next-intl'
import SidebarImport from './SidebarImport'

const Sidebar = () => {
	const t = useTranslations('Basic')

	return (
		<section className='col sidebar'>
			<section className='flex justify-between gap-2 px-4 pt-4' role='menubar'>
				<SidebarSearchField />
				<EditButton noteId={null}>{t('new')}</EditButton>
			</section>
			<nav>
				<Suspense fallback={<NoteListSkeleton />}>
					<SidebarNoteList />
				</Suspense>
			</nav>
			<SidebarImport />
		</section>
	)
}

export default Sidebar
