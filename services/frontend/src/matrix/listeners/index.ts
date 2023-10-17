import { ClientEvent, HttpApiEvent, type MatrixClient } from "matrix-js-sdk"
import { stateStore } from "../../stores/matrix.store"

export function registerListeners(client: MatrixClient) {

  // Sync state with state store, which is used to show loading spinners
  // or disconnected messages.
  client.on(ClientEvent.Sync, (state) => {
    stateStore.set(state)
    client.setGlobalErrorOnUnknownDevices(false)
    client.getCrypto()!.globalBlacklistUnverifiedDevices = false
  })

  // Log out handler, if logged out from the homeserver, clean old tokens and data
  client.on(HttpApiEvent.SessionLoggedOut, async () => {
    client.stopClient()
    await client.clearStores()
    localStorage.removeItem('matrix-secret')
    window.location.reload()
  })
}