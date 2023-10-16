<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { roomsStore } from '../../../stores/matrix.store'

  const dispatch = createEventDispatcher()

  export let extraClass = ''
</script>

<nav class="p-4 bg-gray-700 flex flex-col gap-2 {extraClass}">
  <nav class="flex flex-col">
    {#each $roomsStore.filter(r => r.getType() === undefined) as room (room.roomId)}
      <button class="bg-transparent hover:bg-gray-800 px-2 py-0.25 rounded w-full text-left"
        on:click={() => dispatch('routeSwitch', {
          roomId: room.roomId
        })}>
        {room.name}
      </button>
    {/each}
  </nav>
</nav>