import { IndexedDBStore, createClient, type MatrixClient, IndexedDBCryptoStore, type EmittedEvents } from "matrix-js-sdk";
import { authStore } from "../stores/auth.store";
import { get, readable, type Readable, type Stores, type StoresValues } from "svelte/store";
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
    ],
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

export async function matrixLogout() {
    client.stopClient()
    await client.clearStores()
    localStorage.removeItem('matrix-secret')
    window.location.reload()
}

export type MatrixGetReadableMethod<T, S extends Stores> = (matrix: MatrixClient, stores: StoresValues<S>) => T

export interface MatrixGetReadableOptions<T, S extends Stores> {
  initialValue: T
  events?: EmittedEvents[]
  dependencies?: S
}

export function createMatrixReadable<T, S extends Stores>(getMethod: MatrixGetReadableMethod<T, S>, options: MatrixGetReadableOptions<T, S>): Readable<T> {
  const oneDependency = !Array.isArray(options)
  const dependencies: Readable<any>[] | undefined = options.dependencies ? (oneDependency ? [options.dependencies] : options.dependencies) as Readable<any>[] : undefined
  const values: any[] = []

  function sync() {
    return getMethod(client, dependencies ? (oneDependency ? values[0] : values) : undefined)
  }

  return readable<T>(options.initialValue, (set) => {
    if (!browser) return
    
    const update = () => {
      set(sync())
    }

    options.events?.forEach((event) => {
      client.on(event, update)
    })

    const unsubscribes = dependencies?.map((store, i) => 
      store.subscribe((value: any) => {
        values[i] = value
        set(sync())
      })
    )

    set(sync())

    return () => {
      options.events?.forEach((event) => {
        client.off(event, update)
      })

      unsubscribes?.map(u => u())
    }

  })
}
