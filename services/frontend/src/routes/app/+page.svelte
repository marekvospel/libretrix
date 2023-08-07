<script lang="ts">
  import NavBar from '$lib/components/nav/NavBar.svelte';
  import { roomsStore } from '../../stores/matrix.store'
</script>

<div class="flex flex-row">
  <NavBar extraClass="sticky top-0 h-screen" />
  <main class="px-4 py-2">
    {#each $roomsStore.filter(r => r.getType() === undefined) as room (room.roomId)}
      <p>{room.name}</p>
    {/each}
  </main>
</div>