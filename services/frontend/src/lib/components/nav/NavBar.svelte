<script lang="ts">
  import { roomsStore } from '../../../stores/matrix.store'

  export let extraClass = ''
</script>

<nav class="p-4 bg-gray-700 flex flex-col gap-2 {extraClass}">
  <nav class="flex flex-col">
    {#each $roomsStore.filter(r => r.getType() === undefined) as room (room.roomId)}
      <a href="/app/room/{encodeURIComponent(room.roomId)}" class="w-full">
        <button class="bg-transparent hover:bg-gray-800 px-2 py-0.25 rounded w-full text-left">{room.name}</button>
      </a>
    {/each}
  </nav>
</nav>