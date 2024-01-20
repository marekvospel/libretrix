import type { MatrixClient } from 'matrix-js-sdk'
import { type VerificationRequest, VerifierEvent } from 'matrix-js-sdk/lib/crypto-api'
import { createPopup } from '$lib/popup'

export async function startVerification(_client: MatrixClient, req: VerificationRequest) {
  const verifier = await req.startVerification('m.sas.v1')
  verifier.on(VerifierEvent.ShowSas, async (sas) => {
    createPopup({
      type: 'device-verification',
      sas,
    })
  })

  await verifier.verify()
}
