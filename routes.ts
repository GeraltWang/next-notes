/**
 * 公共访问路由
 * 无需鉴权
 * @type {string[]}
 */
export const publicRoutes = ['/', '/note/\\d+']

/**
 * 授权路由
 * 用于登录/注册
 * @type {string[]}
 */
export const authRoutes = ['/sign-in', '/sign-up', '/error']

/**
 * API 授权路由前缀
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth'

/**
 * 默认登录重定向地址
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/'
