import { ClientEvent, CryptoEvent, HttpApiEvent, type MatrixClient } from 'matrix-js-sdk'
import { stateStore } from '../../stores/matrixState.store'
import { matrixLogout } from '..'

export function registerListeners(client: MatrixClient) {
  // Sync state with state store, which is used to show loading spinners
  // or disconnected messages.
  client.on(ClientEvent.Sync, (state) => {
    stateStore.set(state)
    // @ts-expect-error: ??? https://github.com/matrix-org/matrix-js-sdk/issues/3802
    client.getCrypto()!.globalErrorOnUnknownDevices = false
  })

  client.on(CryptoEvent.VerificationRequestReceived, async (request) => {
    await request.accept()

    const verifier = await request.startVerification('m.sas.v1')

    // @ts-expect-error: sad but necessary for missing import
    verifier.on('show_sas', async (sas: any) => {
      await sas.confirm()
    })

    await verifier.verify()
  })

  // Log out handler, if logged out from the homeserver, clean old tokens and data
  client.on(HttpApiEvent.SessionLoggedOut, async () => {
    matrixLogout()
  })
}
