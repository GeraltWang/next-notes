import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ProfileForm from './_components/ProfileForm'
import AuthProvider from '@/components/AuthProvider'
import { auth } from 'auth'

const GeneralPage = async () => {
	const session = await auth()
	return (
		<Card>
			<CardHeader>
				<CardTitle>Profile</CardTitle>
				<CardDescription>User information.</CardDescription>
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
