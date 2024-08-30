import { createSharedPathnamesNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'
import { locales, defaultLocale } from './config'

const routing = defineRouting({
  locales,
  defaultLocale
})

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation(routing)
