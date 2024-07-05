'use client'
import { ProfileSchema } from '@/schema/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { updateUserName } from '@/lib/actions/settings.action'
import { useSession } from 'next-auth/react'

import FormError from '@/components/auth/FormError'
import FormSuccess from '@/components/auth/FormSuccess'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const ProfileForm = () => {
	const t = useTranslations('Auth')

	const user = useCurrentUser()

	const { update } = useSession()

	const [error, setError] = useState<string | undefined>('')

	const [success, setSuccess] = useState<string | undefined>('')

	const [isPending, startTransition] = useTransition()

	const form = useForm<z.infer<typeof ProfileSchema>>({
		resolver: zodResolver(ProfileSchema),
		defaultValues: {
			name: user?.name || undefined,
		},
	})

	const onSubmit = (values: z.infer<typeof ProfileSchema>) => {
		setError('')
		setSuccess('')

		startTransition(async () => {
			try {
				const { message, error } = await updateUserName(values)
				error && setError(error)
				if (message) {
					setSuccess(message)
					update()
				}
			} catch (error) {
				setError((error as Error).message)
			}
		})
	}

	return (
		<Form {...form}>
			<form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
				<div className='space-y-4'>
					<FormItem>
						<FormLabel>{t('email')}</FormLabel>
						<Input value={user?.email as string} type='email' disabled />
					</FormItem>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t('name')}</FormLabel>
								<FormControl>
									<Input {...field} type='text' disabled={isPending} placeholder='enter username' />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormError message={error} />
				<FormSuccess message={success} />
				<Button type='submit' disabled={isPending}>
					{t('update')}
				</Button>
			</form>
		</Form>
	)
}

export default ProfileForm
