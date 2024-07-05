import bcrypt from 'bcryptjs'
import { DEFAULT_SALT_ROUNDS } from '@/config'

/**
 * 封装 bcrypt 加密方法
 * @param content 明文
 * @param saltRounds 加密强度 默认值见 config DEFAULT_SALT_ROUNDS
 * @returns
 */
export const encrypt = async (content: string, saltRounds: string | number = DEFAULT_SALT_ROUNDS) => {
  return await bcrypt.hash(content, saltRounds)
}

/**
 * 封装 bcrypt 比对方法
 * @param content 明文
 * @param hash 密文
 * @returns
 */
export const compare = async (content: string, hash: string) => {
  return await bcrypt.compare(content, hash)
}
