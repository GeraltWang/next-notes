'use server'
import dayjs from 'dayjs'
import prisma from '@/prisma/client'
import { NoteSchema } from '@/schema/note'
import { z } from 'zod'
import { currentUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getErrorMessage } from '@/lib/utils'

export const getNotes = async () => {
  const user = await currentUser()
  if (!user) {
    return {
      error: 'Access denied!'
    }
  }

  const notes = await prisma.note.findMany({
    where: {
      authorId: user.id
    }
  })

  // 格式化每个笔记的日期字段
  const formattedNotes = notes.map((note) => {
    return {
      ...note,
      createdAt: dayjs(note.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs(note.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    }
  })

  return formattedNotes
}

export const getNoteById = async (noteId: string) => {
  const note = await prisma.note.findUnique({
    where: {
      id: noteId
    }
  })

  if (!note) {
    return null
  }

  return {
    ...note,
    createdAt: dayjs(note.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs(note.updatedAt).format('YYYY-MM-DD HH:mm:ss')
  }
}

export const createNote = async (values: z.infer<typeof NoteSchema>) => {
  const user = await currentUser()
  if (!user) {
    return {
      error: 'Access denied!'
    }
  }

  const validatedFields = NoteSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: 'Invalid note data!'
    }
  }

  const { title, content } = validatedFields.data

  await prisma.note.create({
    data: {
      title,
      content,
      authorId: user.id
    }
  })

  revalidatePath('/', 'layout')
  return { message: 'Note created!' }
}

export const updateNote = async (noteId: string, values: z.infer<typeof NoteSchema>) => {
  const user = await currentUser()
  if (!user) {
    return {
      error: 'Access denied!'
    }
  }

  const validatedFields = NoteSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: 'Invalid note data!'
    }
  }

  const { title, content } = validatedFields.data

  await prisma.note.update({
    where: {
      id: noteId
    },
    data: {
      title,
      content
    }
  })

  revalidatePath('/', 'layout')
  return { message: 'Note updated!' }
}

export const deleteNoteById = async (noteId: string) => {
  const user = await currentUser()
  if (!user) {
    return {
      error: 'Access denied!'
    }
  }
  await prisma.note.delete({
    where: {
      id: noteId
    }
  })

  revalidatePath('/', 'layout')
  redirect('/')
}

export const importNode = async (values: z.infer<typeof NoteSchema>) => {
  try {
    const user = await currentUser()
    if (!user) {
      return {
        error: 'Access denied!'
      }
    }

    const validatedFields = NoteSchema.safeParse(values)
    if (!validatedFields.success) {
      throw new Error('Invalid note data!')
    }

    const { title, content } = validatedFields.data

    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        authorId: user.id
      }
    })

    return {
      message: 'Note imported!',
      noteId: newNote.id
    }
  } catch (error) {
    throw getErrorMessage(error)
  }
}
