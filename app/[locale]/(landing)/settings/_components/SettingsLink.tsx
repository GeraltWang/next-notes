'use client'
import { useCurrentUser } from '@/hooks/use-current-user'
import { usePathname, Link } from '@/navigation'

const SettingsLink = () => {
	const user = useCurrentUser()
	const pathname = usePathname()

	// 定义一个函数来判断链接是否为当前路由
	const isActive = (path: string) => {
		return pathname === path
	}
	return (
		<nav className='grid gap-4 text-sm text-muted-foreground'>
			{user?.isOAuth ? (
				<Link
					href='/settings/general'
					className={`${isActive('/settings/general') ? 'text-primary' : 'text-inherit'} font-semibold`}
				>
					General
				</Link>
			) : (
				<>
					<Link
						href='/settings/general'
						className={`${isActive('/settings/general') ? 'text-primary' : 'text-inherit'} font-semibold`}
					>
						General
					</Link>
					<Link
						className={`${isActive('/settings/security') ? 'text-primary' : 'text-inherit'} font-semibold`}
						href='/settings/security'
					>
						Security
					</Link>
				</>
			)}
		</nav>
	)
}

export default SettingsLink
