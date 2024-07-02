/**
 * 默认登录重定向地址
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/'

/**
 * 登录路由
 */
export const SIGN_IN_ROUTE = '/sign-in'

/**
 * 注册路由
 */
export const SIGN_UP_ROUTE = '/sign-up'

/**
 * 电子邮件验证路由
 */
export const VERIFICATION_ROUTE = '/new-verification'

/**
 * 重置密码路由
 */
export const PASSWORD_RESET_ROUTE = '/new-password'

/**
 * 公共访问路由
 * 无需鉴权
 * @type {string[]}
 */
export const publicRoutes = ['/', VERIFICATION_ROUTE, '/note/\\d+']

/**
 * 授权路由
 * 用于登录/注册
 * @type {string[]}
 */
export const authRoutes = [SIGN_IN_ROUTE, SIGN_UP_ROUTE, '/reset', PASSWORD_RESET_ROUTE, '/error']

/**
 * API 授权路由前缀
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth'
