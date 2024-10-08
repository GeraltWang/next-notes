import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SecurityForm from './_components/SecurityForm'
import AuthProvider from '@/components/AuthProvider'
import { auth } from 'auth'
import { getTranslations } from 'next-intl/server'

const SecurityPage = async () => {
  const session = await auth()

  const t = await getTranslations('Setting')
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('security')}</CardTitle>
        <CardDescription>{t('userSecurity')}</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthProvider session={session}>
          <SecurityForm />
        </AuthProvider>
      </CardContent>
    </Card>
  )
}

export default SecurityPage
