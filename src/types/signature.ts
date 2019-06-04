export interface BlockchainSignature {
  readonly blockchain: string
  readonly signature: string
}

export interface PayloadSignature {
  // This is the payoad being signed with optional embedded blockchain signatures.
  readonly payload: any
  readonly signature: string
  readonly blockchainMovement?: BlockchainMovement
}

export interface BlockchainMovement {
  prefix: string
  address: string
  asset: string
  amount: string
  nonce: string
  userPubKey: string
  userSig?: string
}
