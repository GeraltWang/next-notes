import React from 'react'
import { TriangleAlert } from 'lucide-react'

interface Props {
  message?: string
}

const FormError = ({ message }: Props) => {
  if (!message) return null
  return (
    <div className='flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive'>
      <TriangleAlert className='h-4 w-4' />
      <p>{message}</p>
    </div>
  )
}

export default FormError
