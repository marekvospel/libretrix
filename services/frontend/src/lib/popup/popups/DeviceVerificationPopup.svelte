<script lang='ts'>
  import type { ShowSasCallbacks } from 'matrix-js-sdk/lib/crypto-api'
  import { clearPopup } from '..'

  export const type = 'device-verification'

  export let sas: ShowSasCallbacks

</script>

<h4>Device verification</h4>

<div class='flex flex-row gap-2 items-center justify-center flex-wrap'>
  {#each sas.sas.emoji ?? [] as emoji}
    <div class='flex flex-col gap-1'>
      <p>{emoji[0]}</p>
      <p>{emoji[1]}</p>
    </div>
  {/each}
  <div class='flex flex-row justify-between w-[90%]'>
    <button on:click={() => { sas.mismatch(); clearPopup() }}>They don't match</button>
    <button type='button' on:click={() => { sas.confirm(); clearPopup() }}>They match</button>
  </div>
</div>
