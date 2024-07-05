'use client'
import { reset } from '@/lib/actions/reset.action'
import { ResetSchema } from '@/schema/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { SIGN_IN_ROUTE } from '@/routes'

import FormError from '@/components/auth/FormError'
import FormSuccess from '@/components/auth/FormSuccess'
import CardWrapper from '@/components/CardWrapper'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const ResetForm = () => {
  const t = useTranslations('Auth')

  const [error, setError] = useState<string | undefined>('')

  const [success, setSuccess] = useState<string | undefined>('')

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      reset(values).then((data) => {
        data?.error && setError(data.error)
        data?.message && setSuccess(data.message)
      })
    })
  }
  return (
    <CardWrapper headerLabel={t('forgotPassword')} backButtonLabel={t('backToSignIn')} backButtonHref={SIGN_IN_ROUTE}>
      <Form {...form}>
        <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
          <div className='space-y-4'>
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
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button className='w-full' type='submit' disabled={isPending}>
            {t('sendResetEmail')}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default ResetForm
