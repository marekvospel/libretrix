<script lang='ts'>
  import DeviceVerificationPopup from './popups/DeviceVerificationPopup.svelte'
  import { currentPopup } from './index'
</script>

{#if $currentPopup}
  <div class='fixed left-[50%] top-[50%] -translate-[50%] bg-surface0 px-8 py-4 rounded-lg flex flex-col items-center'>
    {#if $currentPopup.type === 'device-verification'}
      <DeviceVerificationPopup {...$currentPopup} />
    {/if}
  </div>
{/if}
