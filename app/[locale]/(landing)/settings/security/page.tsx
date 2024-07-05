import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SecurityForm from './_components/SecurityForm'
import AuthProvider from '@/components/AuthProvider'
import { auth } from 'auth'

const SecurityPage = async () => {
	const session = await auth()
	return (
		<Card>
			<CardHeader>
				<CardTitle>Security</CardTitle>
				<CardDescription>User security feature.</CardDescription>
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
