import { compare, hash } from 'bcrypt'
import { getFromEnv } from './misc.server'

const generateHash = async (password: string) => {
  return hash(password, Number(getFromEnv('HASH_ROUNDS')))
}

const compareHash = async (password: string, hash: string) => {
  return compare(password, hash)
}

export { compareHash, generateHash }
