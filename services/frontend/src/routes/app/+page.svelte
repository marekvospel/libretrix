<script lang="ts">
  import NavBar from '$lib/components/nav/NavBar.svelte'

  let currentRoom: string | undefined = undefined
</script>

<div class="flex flex-row">
  <NavBar extraClass="sticky top-0 h-screen" on:routeSwitch={(room) => currentRoom = room.detail.roomId}/>
  <main class="px-4 py-2">
    <p>{ currentRoom }</p>
  </main>
</div>