export interface Note {
  id: string
  authorId: string
  title: string
  content: string
  updatedAt: string
}

export interface SearchParamProps {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
