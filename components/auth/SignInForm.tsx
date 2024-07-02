'use client'
import { signInUser } from '@/lib/actions/sign-in.action'
import { SignInSchema } from '@/schema/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import FormError from '@/components/auth/FormError'
import FormSuccess from '@/components/auth/FormSuccess'
import CardWrapper from '@/components/CardWrapper'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

const SignInForm = () => {
	const searchParams = useSearchParams()
	const urlError =
		searchParams.get('error') === 'OAuthAccountNotLinked' ? 'Email is already in use by another account!' : ''

	const [show2FA, setShow2FA] = useState(false)

	const [error, setError] = useState<string | undefined>('')

	const [success, setSuccess] = useState<string | undefined>('')

	const [isPending, startTransition] = useTransition()

	const form = useForm<z.infer<typeof SignInSchema>>({
		resolver: zodResolver(SignInSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const onSubmit = (values: z.infer<typeof SignInSchema>) => {
		setError('')
		setSuccess('')

		startTransition(() => {
			signInUser(values)
				.then(data => {
					if (data?.error) {
						form.reset()
						setError(data.error)
					}
					if (data?.message) {
						form.reset()
						setSuccess(data.message)
					}

					if (data?.twoFactor) {
						setShow2FA(true)
					}
				})
				.catch(() => {
					setError('An error occurred!')
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
						{show2FA && (
							<FormField
								control={form.control}
								name='code'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Two Factor Code</FormLabel>
										<FormControl>
											<Input {...field} disabled={isPending} type='text' placeholder='two factor code' />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
						{!show2FA && (
							<>
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
											<Button className='px-0 font-normal' size={'sm'} variant={'link'} asChild>
												<Link href={'/reset'}>Forgot password?</Link>
											</Button>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}
					</div>
					<FormError message={error || urlError} />
					<FormSuccess message={success} />
					<Button className='w-full' type='submit' disabled={isPending}>
						{show2FA ? 'Confirm' : 'Sign In'}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}

export default SignInForm
