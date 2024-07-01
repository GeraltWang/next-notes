/**
 * 默认登录重定向地址
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/'

/**
 * 电子邮件验证路由
 */
export const VERIFICATION_ROOT = '/new-verification'

/**
 * 重置密码路由
 */
export const PASSWORD_RESET_ROOT = '/new-password'

/**
 * 公共访问路由
 * 无需鉴权
 * @type {string[]}
 */
export const publicRoutes = ['/', VERIFICATION_ROOT, '/note/\\d+']

/**
 * 授权路由
 * 用于登录/注册
 * @type {string[]}
 */
export const authRoutes = ['/sign-in', '/sign-up', '/reset', PASSWORD_RESET_ROOT, '/error']

/**
 * API 授权路由前缀
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth'
