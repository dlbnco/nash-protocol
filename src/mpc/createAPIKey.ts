import { MPCWalletModulePromise } from './wasmModule'
import { postAndGetBodyAsJSON } from './utils'
import { fillRPoolIfNeeded } from './fillRPool'
import { CreateApiKeyParams, APIKeyResult } from '../types/MPC'

// Do we need to cache this key?
const paillierPKs = new Map<string, Promise<string>>()

export async function createAPIKey({
  secret,
  fillPoolUrl,
  generateProofUrl
}: CreateApiKeyParams): Promise<APIKeyResult> {
  await fillRPoolIfNeeded({ fillPoolUrl })
  const MPCwallet = await MPCWalletModulePromise
  let apikeycreator = ''

  // paillier key not verified yet.
  if (paillierPKs.has(secret) === false) {
    let resolver: (s: string) => void = () => null
    paillierPKs.set(
      secret,
      new Promise(r => {
        resolver = r
      })
    )
    const [initSuccess, apiKeyCreatorOrError1] = JSON.parse(MPCwallet.init_apikeycreator(secret)) as [boolean, string]
    if (initSuccess === false) {
      throw new Error('ERROR: initalization failed. ' + apiKeyCreatorOrError1)
    } else {
      apikeycreator = JSON.stringify(apiKeyCreatorOrError1)
      const response = await postAndGetBodyAsJSON(generateProofUrl, {})
      const correctKeyProof = JSON.stringify(response.correct_key_proof)
      const paillierPK = JSON.stringify(response.paillier_pk)
      resolver(paillierPK)
      const [verifyPaillierSuccess, apiKeyCreatorOrError2] = JSON.parse(
        MPCwallet.verify_paillier(apikeycreator, paillierPK, correctKeyProof)
      ) as [boolean, string]
      if (verifyPaillierSuccess === false) {
        throw new Error('ERROR: paillier key verification failed. ' + apiKeyCreatorOrError2)
      } else {
        apikeycreator = JSON.stringify(apiKeyCreatorOrError2)
      }
    }
    // paillier key already verified; skip verification
  } else {
    const previousPaillierPK = await paillierPKs.get(secret)!
    const [initApiKeyCreatorSuccess, initApiKeyWithCreatorStr] = JSON.parse(
      MPCwallet.init_apikeycreator_with_verified_paillier(secret, previousPaillierPK)
    ) as [boolean, string]
    if (initApiKeyCreatorSuccess === false) {
      throw new Error('ERROR: (fast) initalization failed. ' + initApiKeyWithCreatorStr)
    } else {
      apikeycreator = JSON.stringify(initApiKeyWithCreatorStr)
    }
  }

  const [createKeySuccess, apiKeyOrError] = JSON.parse(MPCwallet.create_api_key(apikeycreator)) as
    | [false, string]
    | [true, APIKeyResult]
  if (createKeySuccess === false) {
    throw new Error('ERROR: paillier key not verified. ' + apiKeyOrError)
  } else {
    return apiKeyOrError as APIKeyResult
  }
}
