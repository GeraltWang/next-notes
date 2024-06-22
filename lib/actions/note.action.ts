'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { addNote, updateNote, delNote } from '@/lib/redis'

export const saveNote = async (noteId: string | null, title: string, body: string) => {
	const data = JSON.stringify({
		title,
		content: body,
		updateTime: new Date(),
	})

	if (noteId) {
		updateNote(noteId, data)
		revalidatePath('/', 'layout')
		redirect(`/note/${noteId}`)
	} else {
		const res = await addNote(data)
		revalidatePath('/', 'layout')
		redirect(`/note/${res}`)
	}
}

export const deleteNote = (noteId: string) => {
	delNote(noteId)
	revalidatePath('/', 'layout')
	redirect('/')
}
