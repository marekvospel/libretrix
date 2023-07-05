<script lang="ts">
  import { HttpApiEvent, IndexedDBCryptoStore, IndexedDBStore, createClient } from "matrix-js-sdk";
  import { onMount } from "svelte";
  import { authStore } from "../../stores/auth.store";
  import { get } from "svelte/store";


  onMount(async () => {
    const authData = get(authStore)

    const store = new IndexedDBStore({
      indexedDB: window.indexedDB,
      localStorage: window.localStorage,
      dbName: 'matrix-store'
    })

    await store.startup()

    const client = createClient({
      baseUrl: authData.baseUrl!,
      accessToken: authData.accessToken,
      deviceId: authData.deviceId,
      userId: authData.userId,
      store,
      cryptoStore: new IndexedDBCryptoStore(window.indexedDB, 'matrix-crypto-store')
    })
    
    await client.startClient()
    await client.initCrypto()

    client.on(HttpApiEvent.SessionLoggedOut, async () => {
      client.stopClient()
      await client.clearStores()
      localStorage.removeItem('matrix-secret')
      window.location.reload()
    })
  })

</script>


hi