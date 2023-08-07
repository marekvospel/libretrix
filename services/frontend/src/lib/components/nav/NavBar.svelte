<script lang="ts">
  import { RoomType } from 'matrix-js-sdk';
  import { roomsStore } from '../../../stores/matrix.store'
  import { client } from '../../../matrix'

  import NavSpace from './NavSpace.svelte';

  export let extraClass = ''
</script>

<nav class="p-4 bg-gray-700 flex flex-col gap-2 {extraClass}">
  <NavSpace icon="i-bx:home" />
  {#each $roomsStore.filter(r => r.getType() === RoomType.Space) as room (room.roomId)}
    <NavSpace image={room.getAvatarUrl(client.baseUrl, 64, 64, 'scale') ?? ''} name={room.name}/>
  {/each}
</nav>