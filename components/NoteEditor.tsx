'use client'
import { createNote, deleteNoteById, updateNote } from '@/lib/actions/notes.action'
import { useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { NoteSchema } from '@/schema/note'

import NotePreview from '@/components/NotePreview'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  noteId: string | null
  initialTitle: string
  initialBody: string
}

const NoteEditor = ({ noteId, initialTitle, initialBody }: Props) => {
  const t = useTranslations('Basic')

  const isDraft = !noteId

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof NoteSchema>>({
    resolver: zodResolver(NoteSchema),
    defaultValues: {
      title: initialTitle,
      content: initialBody
    }
  })

  // 使用watch方法观察title和content的值
  const title = form.watch('title')
  const content = form.watch('content')

  const onSubmit = (values: z.infer<typeof NoteSchema>) => {
    startTransition(async () => {
      if (isDraft) {
        await createNote(values)
      } else {
        await updateNote(noteId, values)
      }
    })
  }

  const onDelete = async () => {
    startTransition(async () => {
      if (!noteId) return
      const res = await deleteNoteById(noteId)
      console.log(res)
    })
  }

  return (
    <div className='note-editor'>
      <div className='sticky top-0 flex w-[400px] shrink-0 flex-col'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='flex justify-end gap-2'>
              {!isDraft && (
                <Button size={'sm'} variant={'destructive'} onClick={onDelete}>
                  {t('delete')}
                </Button>
              )}
              <Button size={'sm'} type='submit' disabled={isPending}>
                {t('save')}
              </Button>
            </div>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>title</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} type='text' placeholder='your note title' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>content</FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled={isPending} placeholder='your note content' rows={28} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
      {/* <form className='note-editor-form' autoComplete='off'>
				<div className='note-editor-menu' role='menubar'>
					<input type='hidden' name='noteId' value={noteId || ''} />
					<SaveButton formAction={saveFormAction} />
					<DeleteButton isDraft={isDraft} formAction={delFormAction} />
				</div>
				<div className='note-editor-menu'>
					{saveState?.message}
					{saveState.errors && saveState.errors[0].message}
				</div>
				<label className='offscreen' htmlFor='note-title-input'>
					Enter a title for your note
				</label>
				<input
					id='note-title-input'
					type='text'
					name='title'
					value={title}
					onChange={e => {
						setTitle(e.target.value)
					}}
				/>
				<label className='offscreen' htmlFor='note-body-input'>
					Enter the body for your note
				</label>
				<textarea name='body' value={body} id='note-body-input' onChange={e => setBody(e.target.value)} />
			</form> */}
      <div className='note-editor-preview'>
        <div className='label label--preview' role='status'>
          Preview
        </div>
        <h1 className='note-title'>{title}</h1>
        <NotePreview>{content}</NotePreview>
      </div>
    </div>
  )
}

export default NoteEditor
