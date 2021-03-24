import os from 'os'
import wasm from '../wasm'
interface NodeFileInterface {
  dh_init: (size: number, curve: string) => string
  fill_rpool: (clientDHSecrets: string, serverDHPublics: string, curve: string, pkstr: string) => string
  get_rpool_size: (curve: string) => string
  compute_presig: (apiKeyStr: string, msgHashStr: string, curve: string) => string
  sign: (secretkey: string, hash: string) => string
}

const loadNodeFile = (): NodeFileInterface => {
  const platform = os.platform()

  switch (platform) {
    // case 'aix':
    // case 'android':
    // case 'freebsd':
    // case 'openbsd':
    // case 'sunos':
    // case 'netbsd':
    case 'cygwin':
    case 'win32':
      return require('./index_win.node')
    case 'linux':
      return require('./index_linux.node')
    case 'darwin':
      return require('./index_osx.node')
    default:
      console.log('Using .wasm shim')
      return wasm
  }
}

const MpcWallet = loadNodeFile()
export function dh_init(size: number, curve: string): string {
  if (wasm === MpcWallet) {
    // wasm expects double quotes for the curve param
    return wasm.dh_init(size, JSON.stringify(curve))
  }
  return MpcWallet.dh_init(size, curve)
}
export function fill_rpool(clientDHSecrets: string, serverDHPublics: string, curve: string, pkstr: string): string {
  if (wasm === MpcWallet) {
    // wasm expects double quotes for the curve param
    return wasm.fill_rpool(clientDHSecrets, serverDHPublics, JSON.stringify(curve), pkstr)
  }
  return MpcWallet.fill_rpool(clientDHSecrets, serverDHPublics, pkstr, curve)
}
export function get_rpool_size(curve: string): string {
  if (wasm === MpcWallet) {
    // wasm expects double quotes for the curve param
    return wasm.get_rpool_size(JSON.stringify(curve))
  }
  return MpcWallet.get_rpool_size(curve)
}
export function compute_presig(apiKeyStr: string, msgHashStr: string, curve: string): string {
  if (wasm === MpcWallet) {
    // wasm expects double quotes for the curve param
    return wasm.compute_presig(apiKeyStr, msgHashStr, JSON.stringify(curve))
  }
  return MpcWallet.compute_presig(apiKeyStr, msgHashStr, curve)
}

export const init_api_childkey_creator = wasm.init_api_childkey_creator
export const init_api_childkey_creator_with_verified_paillier = wasm.init_api_childkey_creator_with_verified_paillier
export const verify_paillier = wasm.verify_paillier
export const create_api_childkey = wasm.create_api_childkey
export const verify = wasm.verify
export const publickey_from_secretkey = wasm.publickey_from_secretkey
export const sign = wasm.sign
// export function sign(secret: string, hash: string): string {
//   if (wasm === MpcWallet) {
//     return wasm.sign(secret, hash)
//   }
//   console.log('native sign')
//   return MpcWallet.sign(secret, hash)
// }
