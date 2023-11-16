<script lang="ts">
  import { SyncState } from "matrix-js-sdk/lib/sync";
  import { stateStore } from "../stores/matrixState.store";
  import { t } from 'svelte-i18n'
  import AppView from "$lib/views/AppView.svelte";
</script>

{#if $stateStore === null || $stateStore === SyncState.Prepared }
  <div class="h-full w-full min-h-screen flex flex-col gap-8 items-center justify-center preserve-3d">
    <div class="text-8xl i-bx:loader-alt animate-cspin" />
    <h1 class="text-4xl font-bold">{$t('app.loading')}...</h1>
  </div>
{:else} 
  <AppView />
{/if}

<style>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-cspin {
  animation: spin 500ms linear infinite;
}
</style>