<script lang='ts'>
  import LibretrixContainer from '../components/LibretrixContainer.svelte'
  import SettingsPage from './pages/SettingsPage.svelte'
  import ChatPage from './pages/ChatPage.svelte'
  import NavBar from '$lib/components/nav/NavBar.svelte'
  import { appState } from '$lib/app-state'

</script>

<div class='flex flex-row'>
  <NavBar extraClass='sticky top-0 h-screen' on:routeSwitch={(event) => {
    appState.setRoute(event.detail.route ?? $appState.route); if (event.detail.roomId)
      appState.setRoom(event.detail.roomId)
  }} />
  <main class='w-full h-screen overflow-y-auto relative2'>
    <div class='hidden right-col' />
    <LibretrixContainer class='pt-2 w-full h-full grid {$appState.selectedUser ? 'right-col' : 'grid-cols-1'}'>
      {#if $appState.route === 'room'}
        <ChatPage />
      {:else if $appState.route === 'settings'}
        <SettingsPage />
      {/if}
    </LibretrixContainer>
  </main>
</div>

<style>

.right-col {
  grid-template-columns: minmax(0, 1fr) minmax(0, 20rem);
}

</style>
