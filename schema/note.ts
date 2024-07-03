import { z } from 'zod'

export const NoteSchema = z.object({
	title: z.string().min(1, '请填写标题'),
	content: z.string().min(1, '请填写内容').max(2000, '字数最多 2000'),
})
