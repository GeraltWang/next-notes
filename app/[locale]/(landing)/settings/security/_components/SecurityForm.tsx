'use client'
import { useCurrentUser } from '@/hooks/use-current-user'
import { updateUserSecurity } from '@/lib/actions/settings.action'
import { SecuritySchema } from '@/schema/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useSession } from 'next-auth/react'

import FormError from '@/components/auth/FormError'
import FormSuccess from '@/components/auth/FormSuccess'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

const SecurityForm = () => {
	const t = useTranslations('Auth')

	const user = useCurrentUser()

	const { update } = useSession()

	const [error, setError] = useState<string | undefined>('')

	const [success, setSuccess] = useState<string | undefined>('')

	const [isPending, startTransition] = useTransition()

	const form = useForm<z.infer<typeof SecuritySchema>>({
		resolver: zodResolver(SecuritySchema),
		defaultValues: {
			isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
			password: undefined,
			newPassword: undefined,
		},
	})

	const onSubmit = (values: z.infer<typeof SecuritySchema>) => {
		setError('')
		setSuccess('')

		startTransition(async () => {
			try {
				const res = await updateUserSecurity(values)
				if (res?.error) {
					setError(res.error)
					return
				}
				if (res?.message) {
					setSuccess(res.message)
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
					<FormField
						control={form.control}
						name='isTwoFactorEnabled'
						render={({ field }) => (
							<FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
								<div className='space-y-0.5'>
									<FormLabel>{t('isTwoFactorEnabled')}</FormLabel>
									<FormDescription>{t('isTwoFactorEnabledDescription')}</FormDescription>
								</div>
								<FormControl>
									<Switch disabled={isPending} checked={field.value} onCheckedChange={field.onChange} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t('password')}</FormLabel>
								<FormControl>
									<Input {...field} type='password' disabled={isPending} placeholder='enter current password' />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='newPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t('newPassword')}</FormLabel>
								<FormControl>
									<Input {...field} type='password' disabled={isPending} placeholder='enter new password' />
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

export default SecurityForm
