import { Wallet, Config, Asset, Market, AEAD } from '../types'
import decryptSecretKey from '../decryptSecretKey'
import secretKeyToMnemonic from '../secretKeyToMnemonic'
import mnemonicToMasterSeed from '../mnemonicToMasterSeed'
import { generateNashPayloadSigningKey, generateWallet, coinTypeFromString } from '../generateWallet'

export interface InitParams {
  encryptionKey: Buffer
  aead: AEAD
  walletIndices: { readonly [key: string]: number }
  assetData: { readonly [key: string]: Asset }
  marketData: { readonly [key: string]: Market }
  net?: 'MainNet' | 'TestNet' | 'LocalNet'
}

// initialize takes in the init parameters and returns a Config object with all the
// derived keys.
export async function initialize(params: InitParams): Promise<Config> {
  const secretKey = await decryptSecretKey(params.encryptionKey, params.aead)
  const masterSeed = mnemonicToMasterSeed(secretKeyToMnemonic(secretKey))

  const wallets: Record<string, Wallet> = {}
  for (const [name, index] of Object.entries(params.walletIndices)) {
    wallets[name] = generateWallet(masterSeed, coinTypeFromString(name), index, params.net)
  }

  const nashSigningKey = generateNashPayloadSigningKey(masterSeed, 1)
  if (nashSigningKey.privateKey === undefined) {
    throw new Error('nash private is undefined')
  }

  const payloadSigningKey = generateNashPayloadSigningKey(masterSeed, 0)

  return {
    assetData: params.assetData,
    marketData: params.marketData,
    payloadSigningKey,
    wallets
  }
}
