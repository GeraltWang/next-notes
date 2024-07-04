import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		// 在next.js中，所有的网络图片都要在此处配置来源
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
			},
		],
	},
	async rewrites() {
		return [
			{
				source: '/en/api/:path*',
				destination: '/api/:path*', // 不改变路径，但避免自动加上语言前缀
			},
			{
				source: '/zh/api/:path*',
				destination: '/api/:path*', // 不改变路径，但避免自动加上语言前缀
			},
		]
	},
}

export default withNextIntl(nextConfig)
