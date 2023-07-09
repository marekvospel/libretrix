import { IndexedDBStore, createClient, type MatrixClient, IndexedDBCryptoStore } from "matrix-js-sdk";
import { authStore } from "../stores/auth.store";
import { get } from "svelte/store";
import { registerListeners } from "./listeners";

export let client!: MatrixClient

export async function initClient(): Promise<{ value: Promise<void> }> {
  const authData = get(authStore)

  const store = new IndexedDBStore({
    indexedDB: window.indexedDB,
    localStorage: window.localStorage,
    dbName: 'matrix-store'
  })

  await store.startup()

  const initClient = createClient({
    baseUrl: authData.baseUrl!,
    accessToken: authData.accessToken,
    deviceId: authData.deviceId,
    userId: authData.userId,
    store,
    cryptoStore: new IndexedDBCryptoStore(window.indexedDB, 'matrix-crypto-store'),
    verificationMethods: [
      'm.sas.v1'
    ]
  })

  registerListeners(initClient)

  client = initClient

  return {
    value: new Promise(async (resolve) => {
    await initClient.initCrypto()
    await initClient.startClient()

    resolve()
  })
}

}
