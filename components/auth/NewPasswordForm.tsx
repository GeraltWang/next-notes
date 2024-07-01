'use client'
import { newPassword } from '@/lib/actions/new-password.action'
import { ResetPasswordSchema } from '@/schema/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'

import FormError from '@/components/auth/FormError'
import FormSuccess from '@/components/auth/FormSuccess'
import CardWrapper from '@/components/CardWrapper'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const NewPasswordForm = () => {
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	const [error, setError] = useState<string | undefined>('')

	const [success, setSuccess] = useState<string | undefined>('')

	const [isPending, startTransition] = useTransition()

	const form = useForm<z.infer<typeof ResetPasswordSchema>>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			password: '',
		},
	})

	const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
		setError('')
		setSuccess('')

		startTransition(() => {
			newPassword(values, token).then(data => {
				data?.error && setError(data.error)
				data?.message && setSuccess(data.message)
			})
		})
	}
	return (
		<CardWrapper headerLabel={'Password reset'} backButtonLabel={'Back to sign in'} backButtonHref='/sign-in'>
			<Form {...form}>
				<form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
					<div className='space-y-4'>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>New password</FormLabel>
									<FormControl>
										<Input {...field} disabled={isPending} type='password' placeholder='enter new password' />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormError message={error} />
					<FormSuccess message={success} />
					<Button className='w-full' type='submit' disabled={isPending}>
						Confirm
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}

export default NewPasswordForm
