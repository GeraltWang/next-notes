import type { AuthError } from 'next-auth'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getErrorMessage = (error: unknown) => {
  let message: string
  if (error instanceof Error) {
    message = error.message
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String(error.message)
  } else if (typeof error === 'string') {
    message = error
  } else {
    message = 'Something went wrong!'
  }
  return message
}

export const handleError = (error: unknown) => {
  console.error(error)
  throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
}

export const handleAuthError = (error: AuthError) => {
  console.log('🚀 ~ handleAuthError ~ error:', JSON.stringify(error))
  switch (error.type) {
    case 'CredentialsSignin':
      return {
        error: 'Invalid credentials'
      }
    default:
      return {
        error: 'Something went wrong!'
      }
  }
}

/**
 * 生成过期时间的函数
 * @param durationInMinutes 过期时长，以分钟为单位
 * @returns 返回一个表示过期时间的Date对象
 */
export const generateExpiryTime = (durationInMinutes: number): Date => {
  const now = new Date()
  const expiryTime = new Date(now.getTime() + durationInMinutes * 60000) // 60000毫秒等于1分钟
  return expiryTime
}

export async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const res = await fetch(input, init)

  if (!res.ok) {
    const json = await res.json()
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number
      }
      error.status = res.status
      throw error
    } else {
      throw new Error('An unexpected error occurred')
    }
  }

  return res.json()
}

export function nFormatter(num: number, digits?: number) {
  if (!num) return '0'
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' }
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value
    })
  return item ? (num / item.value).toFixed(digits || 1).replace(rx, '$1') + item.symbol : '0'
}

/**
 * 首字母大写
 * @param str
 * @returns
 */
export function capitalize(str: string) {
  if (!str || typeof str !== 'string') return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 按长度截断字符串并追加省略号
 * @param str 字符串
 * @param length 长度限制
 * @returns
 */
export const truncate = (str: string, length: number) => {
  if (!str || str.length <= length) return str
  return `${str.slice(0, length)}...`
}
