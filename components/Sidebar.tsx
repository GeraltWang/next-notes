import React, { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SidebarNoteList from '@/components/SidebarNoteList'
import EditButton from './EditButton'
import NoteListSkeleton from './NoteListSkeleton'
import SidebarSearchField from './SidebarSearchField'
import { useTranslations } from 'next-intl'

const Sidebar = () => {
	const t = useTranslations('Basic')

	return (
		<section className='col sidebar'>
			<Link href={'/'} className='link--unstyled'>
				<section className='sidebar-header'>
					<Image src='/next.svg' width={64} height={20} alt='logo' role='presentation' />
					<strong>Next Notes</strong>
				</section>
			</Link>
			<section className='sidebar-menu' role='menubar'>
				<SidebarSearchField />
				<EditButton noteId={null}>{t('new')}</EditButton>
			</section>
			<nav>
				<Suspense fallback={<NoteListSkeleton />}>
					<SidebarNoteList />
				</Suspense>
			</nav>
		</section>
	)
}

export default Sidebar
