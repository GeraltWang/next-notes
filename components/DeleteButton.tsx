import { useFormStatus } from 'react-dom'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface Props {
  formAction: (payload: FormData) => void
  isDraft: boolean
}

const DeleteButton = ({ formAction, isDraft }: Props) => {
  const { pending } = useFormStatus()
  const t = useTranslations('Basic')

  return (
    !isDraft && (
      <button className='note-editor-delete' disabled={pending} formAction={formAction} role='menuitem'>
        <Image src='/cross.svg' width='10' height='10' alt='' role='presentation' />
        {t('delete')}
      </button>
    )
  )
}

export default DeleteButton
