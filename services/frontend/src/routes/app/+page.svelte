<script lang="ts">
  import NavBar from '$lib/components/nav/NavBar.svelte'
  import { get } from 'svelte/store';
  import { client } from '../../matrix';
  import { currentRoomStore } from '../../stores/matrix.store'
  import { eventsStore } from '../../stores/matrix.store'

  let message = ''

  async function send() {
    const msg = message
    message = ''

    try {
      await client.sendMessage(get(currentRoomStore)!, {
        msgtype: "m.text",
        body: msg,
      })
    } catch(e) {
      console.warn(e)
    }

    message = ''

  }
</script>

<div class="flex flex-row">
  <NavBar extraClass="sticky top-0 h-screen" on:routeSwitch={(room) => $currentRoomStore = room.detail.roomId}/>
  <main class="px-4 py-2">
    <p>{ $currentRoomStore }</p>

    {#if $currentRoomStore}
      <ul>
        {#each $eventsStore ?? [] as event (event.getId())}
          {#if event.getType() === "m.room.message"}
            <li>{ event.getSender() } { event.getContent()?.body }</li>
          {/if}
        {/each}
      </ul>

      <form on:submit|preventDefault={send}>
        <input bind:value={message} placeholder="Message" class="text-black" />
        <button type="submit">Send</button>
      </form>
    {/if}
  </main>
</div>
