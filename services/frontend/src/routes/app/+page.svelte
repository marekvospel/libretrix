<script lang="ts">
  import {roomsStore} from '../../stores/matrix.store'

</script>

<ul>
  {#each $roomsStore as room }
    <li>{ room.name }</li>
  {/each}
</ul>