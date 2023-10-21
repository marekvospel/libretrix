<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { roomsStore } from '../../../stores/matrix.store'
  import { matrixLogout } from '../../../matrix'

  const dispatch = createEventDispatcher()

  export let extraClass = ''
</script>

<nav class="p-4 bg-gray-700 flex flex-col gap-2 {extraClass}">
  <nav class="flex flex-col h-full">
    {#each $roomsStore.filter(r => r.getType() === undefined) as room (room.roomId)}
      <button class="bg-transparent hover:bg-gray-800 px-2 py-0.25 rounded w-full text-left duration-300 transition-colors"
        on:click={() => dispatch('routeSwitch', {
          roomId: room.roomId
        })}>
        {room.name}
      </button>
    {/each}

    <button class="
      flex items-center gap-2 mt-auto
      text-red bg-transparent hover:bg-gray-800 px-2 py-1 rounded w-full text-left transition-colors duration-300
    " on:click={matrixLogout}>
      <span class="inline-block i-bx:log-out"></span>
      <span>Log out</span>
    </button>
  </nav>
</nav>