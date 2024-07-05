'use client'
import { newPassword } from '@/lib/actions/new-password.action'
import { ResetPasswordSchema } from '@/schema/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
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
import { SIGN_IN_ROUTE } from '@/routes'

const NewPasswordForm = () => {
  const t = useTranslations('Auth')

  const searchParams = useSearchParams()

  const token = searchParams.get('token')

  const [error, setError] = useState<string | undefined>('')

  const [success, setSuccess] = useState<string | undefined>('')

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: ''
    }
  })

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      newPassword(values, token).then((data) => {
        data?.error && setError(data.error)
        data?.message && setSuccess(data.message)
      })
    })
  }
  return (
    <CardWrapper headerLabel={t('passwordReset')} backButtonLabel={t('backToSignIn')} backButtonHref={SIGN_IN_ROUTE}>
      <Form {...form}>
        <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('newPassword')}</FormLabel>
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
            {t('confirm')}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default NewPasswordForm
