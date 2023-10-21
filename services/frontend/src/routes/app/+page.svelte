<script lang="ts">
  import NavBar from '$lib/components/nav/NavBar.svelte'
  import { get } from 'svelte/store'
  import { client } from '../../matrix'
  import { currentRoomStore } from '../../stores/matrix.store'
  import { eventsStore } from '../../stores/matrix.store'
  import MessageEvent from '$lib/components/message/MessageEvent.svelte'

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
  <main class="py-2 w-full overflow-x-hidden break-words">
    <p>{ $currentRoomStore }</p>

    {#if $currentRoomStore}
      <div class="flex flex-col gap-2">
        {#each $eventsStore ?? [] as event (event.getId())}
          <MessageEvent event={event} />
        {/each}
      </div>

      <form class="w-full sticky bottom-2 pt-8 flex flex-row gap-2 px-4" on:submit|preventDefault={send}>
        <input bind:value={message} placeholder="Message" class="text-black w-full" />
        <button type="submit">Send</button>
      </form>
    {/if}
  </main>
</div>
