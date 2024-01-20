<script lang="ts">
    import { VerificationRequestEvent } from 'matrix-js-sdk/lib/crypto-api';
  import { client, storageKeys } from '../../../matrix'

  let securityKey = ''

  let backupSettingUp = false
  async function setupBackup() {
    if (backupSettingUp) return
    backupSettingUp = true

    const privateKey = client.keyBackupKeyFromRecoveryKey(securityKey)
    const backupInfo = await client.getKeyBackupVersion();

    const defaultKey = client.getAccountData('m.secret_storage.default_key')?.getContent()?.key
    const isCorrect = await client.checkSecretStorageKey(privateKey, client.getAccountData(`m.secret_storage.key.${defaultKey}`)?.getContent()!);

    if (isCorrect) {
      storageKeys.set(defaultKey, privateKey)
    }

    if (!await client.getCrypto()?.isCrossSigningReady()) {
      await client.getCrypto()?.bootstrapCrossSigning({
        setupNewCrossSigning: true,
      })
    }
    await client.checkOwnCrossSigningTrust()

    await client.restoreKeyBackupWithSecretStorage(backupInfo!, undefined, undefined)

    console.log(await client.getCrypto()?.checkKeyBackupAndEnable())
    
    securityKey = ''
    backupSettingUp = false
  }
  
  async function verifyDevice(device: string) {
    const req = await client.requestVerification(client.getUserId() ?? '', [device])

    req.on(VerificationRequestEvent.Change, async () => {
      const verifier = await req.startVerification('m.sas.v1')
      // @ts-expect-error: sad but necessary for missing import
      verifier.on('show_sas', async (sas) => {
        await sas.confirm()
      })

      await verifier.verify()
    })

      
  }
</script>


<div class="px-4 flex flex-col gap-4">
  <h1 class="text-4xl font-bold">Settings</h1>
  <div class="flex flex-col gap-2">
    <h2 class="text-2xl font-bold">Security</h2>
    <h3 class="text-xl font-semibold">Cross-signing</h3>
    <div>
      {#await client.getCrypto()?.isCrossSigningReady() }
        Loading...
      {:then sign} 
        {#if sign}
          <p>Cross-signing is <strong>ready</strong></p>
        {:else}
          <p>Cross-signing is <strong>not ready</strong></p>
        {/if}
      {/await}
    </div>

    <h3 class="text-xl font-semibold">Secure backup</h3>
    <div>
      {#await Promise.all([client.getCrypto()?.getActiveSessionBackupVersion()]) }
        Loading...
      {:then [version]}
        {#if version === null}
          <p>Your keys are <strong>not being backed up from this session</strong></p>
          <!-- <form on:submit|preventDefault={setupBackup}>
            <input bind:value={securityKey} placeholder="Security key" class="bg-gray-700 rounded px-2 py-1 border border-transparent">
            <button type="submit" class="bg-cyan-500 py-1 px-2 rounded">Setup backup</button>
          </form> -->
        {:else}
          Version: {version}
        {/if}
      {/await}
    </div>

    <h3 class="text-xl font-semibold">Devices</h3>

    <div class="flex flex-col gap-2">

      {#await client.getDevices()}
        Loading...
      {:then devices} 
        {#each devices.devices ?? [] as device (device['device_id'])}
          <div class="flex flex-row items-center gap-4 bg-surface1 rounded px-4 py-2">
            <span class="text-2xl { client.checkDeviceTrust(client.getUserId() ?? '', device['device_id']).isVerified() ? 'text-green i-bxs:shield' : 'text-red i-bx:shield'}" />
            <div>
              <h4 class="font-bold">{ device['display_name'] }</h4>
              <p>{device['device_id']}</p>
            </div>
            {#if !client.checkDeviceTrust(client.getUserId() ?? '', device['device_id']).isVerified()}
              <button on:click={() => verifyDevice(device['device_id'])} class="bg-teal px-2 py-1 rounded-sm">Verify device</button>
            {/if}
          </div>
        {/each}
      {/await}

    </div>
  </div>



</div>