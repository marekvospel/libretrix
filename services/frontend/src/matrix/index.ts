import { IndexedDBStore, createClient, type MatrixClient, IndexedDBCryptoStore, type EmittedEvents } from "matrix-js-sdk";
import { authStore } from "../stores/auth.store";
import { get, readable, type Readable } from "svelte/store";
import { registerListeners } from "./listeners";
import { browser } from '$app/environment'

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

export type MatrixGetReadableMethod<T> = (matrix: MatrixClient) => T

export interface MatrixGetReadableOptions<T> {
  initialValue: T
  events?: EmittedEvents[]
  dependencies?: any[]
}

export function createMatrixReadable<T>(getMethod: MatrixGetReadableMethod<T>, options: MatrixGetReadableOptions<T>): Readable<T> {

  return readable<T>(options.initialValue, (set) => {
    if (!browser) return

    const update = () => {
      set(getMethod(client))
    }

    for (const event of (options.events ?? [])) {
      client.on(event, update)
    }

    set(getMethod(client))

    return () => {
      for (const event of (options.events ?? [])) {
        client.off(event, update)
      }

    }
  })
}
