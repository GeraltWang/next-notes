import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ProfileForm from './_components/ProfileForm'
import AuthProvider from '@/components/AuthProvider'
import { auth } from 'auth'
import { getTranslations } from 'next-intl/server'

const GeneralPage = async () => {
  const session = await auth()

  const t = await getTranslations('Setting')
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile')}</CardTitle>
        <CardDescription>{t('userInfo')}</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthProvider session={session}>
          <ProfileForm />
        </AuthProvider>
      </CardContent>
    </Card>
  )
}

export default GeneralPage
