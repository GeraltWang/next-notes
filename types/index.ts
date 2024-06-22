export interface Note {
	title: string
	content: string
	updateTime: string
}

export interface SearchParamProps {
	params: { id: string }
	searchParams: { [key: string]: string | string[] | undefined }
}
