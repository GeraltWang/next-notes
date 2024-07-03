interface Props {
	title: string
	updateTime: string
}

const SidebarNoteItemHeader = ({ title, updateTime }: Props) => {
	return (
		<header className='sidebar-note-header'>
			<strong>{title}</strong>
			<small>{updateTime}</small>
		</header>
	)
}

export default SidebarNoteItemHeader
