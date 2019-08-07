import scrypt from 'scrypt-js'

import normalizeString from '../utils/normalizeString'

/*
  scrypt parameters recommended by spec document.

  N given by Cure53; 2^20 === 1048576. However this takes unacceptably long; using
  2^16 === 65536 for now.

  The salt should be the user email.
 */
const N = 2 ** 16
const r = 8
const p = 1
const dkLen = 32

export default function hashPassword(password: string, salt: string): Promise<Buffer> {
  return new Promise(res =>
    scrypt(normalizeString(password), normalizeString(salt), N, r, p, dkLen, (error: Error, _: number, key: string) => {
      // throw instead of reject because this will only happen on code error
      if (error) {
        throw error
      }

      // Progress tracker unhandled, we can incorporate it later if needed
      if (key) {
        return res(Buffer.from(key))
      }
    })
  )
}
