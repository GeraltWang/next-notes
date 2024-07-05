'use client'
import { signUpUser } from '@/lib/actions/sign-up.action'
import { SignUpSchema } from '@/schema/user'
import { useTranslations } from 'next-intl'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState, useTransition } from 'react'
import { SIGN_IN_ROUTE } from '@/routes'

import FormError from '@/components/auth/FormError'
import FormSuccess from '@/components/auth/FormSuccess'
import CardWrapper from '@/components/CardWrapper'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const SignUpForm = () => {
  const t = useTranslations('Auth')

  const [error, setError] = useState<string | undefined>('')

  const [success, setSuccess] = useState<string | undefined>('')

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: '',
      password: '',
      name: ''
    }
  })

  const onSubmit = (values: z.infer<typeof SignUpSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      signUpUser(values).then((data) => {
        data?.error && setError(data.error)
        data?.message && setSuccess(data.message)
      })
    })
  }

  return (
    <CardWrapper
      showSocial
      headerLabel={t('createAccount')}
      backButtonLabel={t('haveAccount')}
      backButtonHref={SIGN_IN_ROUTE}
    >
      <Form {...form}>
        <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} type='text' placeholder='enter username' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
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
                  <FormLabel>{t('password')}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} type='password' placeholder='enter password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button className='w-full' type='submit' disabled={isPending}>
            {t('signUp')}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default SignUpForm
