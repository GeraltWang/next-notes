'use client'
import { loginUser } from '@/lib/actions/login.action'
import { LoginSchema } from '@/schema/user'
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

const SignInForm = () => {
	const searchParams = useSearchParams()
	const urlError =
		searchParams.get('error') === 'OAuthAccountNotLinked' ? 'Email is already in use by another account!' : ''

	const [error, setError] = useState<string | undefined>('')

	const [success, setSuccess] = useState<string | undefined>('')

	const [isPending, startTransition] = useTransition()

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		setError('')
		setSuccess('')

		startTransition(() => {
			loginUser(values).then(data => {
				data?.error && setError(data.error)
				data?.message && setSuccess(data.message)
			})
		})
	}

	return (
		<CardWrapper
			showSocial
			headerLabel={'Welcome back'}
			backButtonLabel={"Don't have an account?"}
			backButtonHref='/sign-up'
		>
			<Form {...form}>
				<form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
					<div className='space-y-4'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input {...field} disabled={isPending} type='email' placeholder='example@email.com' />
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
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input {...field} disabled={isPending} type='password' placeholder='enter password' />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormError message={error || urlError} />
					<FormSuccess message={success} />
					<Button className='w-full' type='submit' disabled={isPending}>
						Sign In
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}

export default SignInForm
