'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { addNote, updateNote, delNote } from '@/lib/redis'
import { z, type ZodIssue } from 'zod'

interface State {
	message?: string
	errors?: ZodIssue[]
}

const schema = z.object({
	title: z.string(),
	content: z.string().min(1, '请填写内容').max(2000, '字数最多 2000'),
})

export const saveNote = async (prevState: State, formData: FormData) => {
	const noteId = formData.get('noteId')

	const data = {
		title: formData.get('title'),
		content: formData.get('body'),
		updateTime: new Date(),
	}

	// 校验数据
	const validated = schema.safeParse(data)
	if (!validated.success) {
		return {
			errors: validated.error.issues,
		}
	}

	if (noteId) {
		updateNote(noteId as string, JSON.stringify(data))
		revalidatePath('/', 'layout')
	} else {
		await addNote(JSON.stringify(data))
		revalidatePath('/', 'layout')
	}
	return { message: `Add Success!` }
}

export const deleteNote = (prevState: State, formData: FormData) => {
	const noteId = formData.get('noteId')
	delNote(noteId as string)
	revalidatePath('/', 'layout')
	redirect('/')
}
