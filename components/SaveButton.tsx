import React from 'react'
import Image from 'next/image'
import { useFormStatus } from 'react-dom'
import { useTranslations } from 'next-intl'

interface Props {
  formAction: (payload: FormData) => void
}

const SaveButton = ({ formAction }: Props) => {
  const t = useTranslations('Basic')
  const { pending } = useFormStatus()

  return (
    <button className='note-editor-done' disabled={pending} type='submit' role='menuitem' formAction={formAction}>
      <Image src='/checkmark.svg' width='14' height='10' alt='' role='presentation' />
      {pending ? t('saving') : t('save')}
    </button>
  )
}

export default SaveButton
