'use client'
import { LoginSchema } from '@/schema/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import CardWrapper from '@/components/CardWrapper'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import FormError from '@/components/auth/FormError'
import FormSuccess from '@/components/auth/FormSuccess'

const SignInForm = () => {
	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		console.log(values)
	}

	return (
		<CardWrapper showSocial headerLabel={'Welcome back'} backButtonLabel={"Don't have an account?"} backButtonHref=''>
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
										<Input {...field} type='email' placeholder='example@email.com' />
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
										<Input {...field} type='password' placeholder='enter password' />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormError message='' />
					<FormSuccess message='' />
					<Button className='w-full' type='submit'>
						Sign In
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}

export default SignInForm
