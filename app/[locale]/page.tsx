import { useTranslations } from 'next-intl'

export default function Home() {
	const t = useTranslations('Basic')

	return (
		<div className='note--empty-state'>
			<span className='note-text--empty-state'>{t('initText')}</span>
		</div>
	)
}
