import Redis from 'ioredis'
import { type Note } from '@/types'

const redis = new Redis()

const initialData = {
	'1702459181837':
		'{"title":"sunt aut","content":"quia et suscipit suscipit recusandae","updateTime":"2023-12-13T09:19:48.837Z"}',
	'1702459182837':
		'{"title":"qui est","content":"est rerum tempore vitae sequi sint","updateTime":"2023-12-13T09:19:48.837Z"}',
	'1702459188837': '{"title":"ea molestias","content":"et iusto sed quo iure","updateTime":"2023-12-13T09:19:48.837Z"}',
}

export async function getAllNotes(title?: string) {
	let data = await redis.hgetall('notes')
	if (Object.keys(data).length === 0) {
		await redis.hset('notes', initialData)
		data = await redis.hgetall('notes')
	}

	// 将所有笔记转换为对象
	const notes: Note[] = Object.keys(data).map(key => ({
		noteId: key,
		...JSON.parse(data[key] as string),
	}))

	// 如果提供了title，则过滤笔记
	if (title) {
		const filteredNotes = notes.filter(note => note.title === title)
		return filteredNotes
	}

	return notes
}

export async function addNote(data: string) {
	const uuid = Date.now().toString()
	await redis.hset('notes', uuid, data)
	return uuid
}

export async function updateNote(uuid: string, data: string) {
	await redis.hset('notes', uuid, data)
}

export async function getNote(uuid: string) {
	const noteJson = (await redis.hget('notes', uuid)) || null
	return noteJson ? JSON.parse(noteJson) : null
}

export async function delNote(uuid: string) {
	return redis.hdel('notes', uuid)
}

export default redis
