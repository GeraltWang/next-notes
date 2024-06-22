import dayjs from 'dayjs'

interface Props {
	title: string
	updateTime: string
}

const SidebarNoteItemHeader = ({ title, updateTime }: Props) => {
	return (
		<header className='sidebar-note-header'>
			<strong>{title}</strong>
			<small>{dayjs(updateTime).format('YYYY-MM-DD hh:mm:ss')}</small>
		</header>
	)
}

export default SidebarNoteItemHeader
