'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

const SidebarImport = () => {
	const router = useRouter()

	const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const fileInput = e.target

		// Check if the file input has files
		if (!fileInput.files || fileInput.files.length === 0) {
			console.warn('files list is empty')
			return
		}

		// Get the first file from the list and create a FormData object
		const file = fileInput.files[0]
		const formData = new FormData()
		formData.append('file', file)

		try {
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			})

			if (!response.ok) {
				console.error('something went wrong')
				return
			}

			const data = await response.json()
			router.push(`/note/${data.noteId}`)
			router.refresh()
		} catch (error) {
			console.error('something went wrong')
		}

		// 重置 file input
		e.target.type = 'text'
		e.target.type = 'file'
	}
	return (
		<form method='post' encType='multipart/form-data'>
			<div style={{ textAlign: 'center' }}>
				<label htmlFor='file' style={{ cursor: 'pointer' }}>
					Import .md File
				</label>
				<input
					type='file'
					id='file'
					name='file'
					accept='.md'
					onChange={onChange}
					style={{ position: 'absolute', clip: 'rect(0 0 0 0)' }}
				/>
			</div>
		</form>
	)
}

export default SidebarImport
