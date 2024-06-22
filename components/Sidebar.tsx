import React, { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SidebarNoteList from '@/components/SidebarNoteList'
import EditButton from './EditButton'
import NoteListSkeleton from './NoteListSkeleton'

const Sidebar = () => {
	return (
		<section className='col sidebar'>
			<Link href={'/'} className='link--unstyled'>
				<section className='sidebar-header'>
					<Image className='logo' src='/logo.svg' width='22' height='20' alt='logo' role='presentation' />
					<strong>React Notes</strong>
				</section>
			</Link>
			<section className='sidebar-menu' role='menubar'>
				{/* SideSearchField */}
				<EditButton noteId={null}>New</EditButton>
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
