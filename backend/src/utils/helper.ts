import bcrypt from 'bcryptjs'
import config from 'config'

export async function hash(password: string) {
  const SALT = config.get<number>("salt")
  console.log(SALT);

  const salt = await bcrypt.genSalt(+SALT)

  const hash_pw = await bcrypt.hash(password, salt)
  return hash_pw
}


export async function comparePw(password: string, hash: string) {
  return await bcrypt.compare(password, hash)
}