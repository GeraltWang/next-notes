import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

export const { handlers, auth, signIn, signOut } = NextAuth({
	providers: [GitHub],
	callbacks: {
		authorized: async ({ request, auth }) => {
			// const { pathname } = request.nextUrl
			// console.log('🚀 ~ authorized: ~ pathname:', pathname)

			// if (pathname.includes('/note/edit')) return !!auth
			// return true
			return !!auth
		},
	},
})
