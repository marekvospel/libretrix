<script lang="ts">
  import { currentPopup } from './index'
  import DeviceVerificationPopup from './popups/DeviceVerificationPopup.svelte';
</script>

{#if $currentPopup}
  <div class="fixed left-[50%] top-[50%] -translate-[50%] bg-surface0 px-8 py-4 rounded flex flex-col items-center">
    {#if $currentPopup.type === 'device-verification'}
      <DeviceVerificationPopup {...$currentPopup} />
    {/if}
  </div>
{/if}