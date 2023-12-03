<script lang="ts">
  import NavBar from '$lib/components/nav/NavBar.svelte'
  import { get } from 'svelte/store'
  import { client } from '../../matrix'
  import { eventsStore } from '../../stores/matrix.store'
  import MessageEvent from '$lib/components/message/MessageEvent.svelte'
  import { appState } from '$lib/app-state';
  import type { MatrixEvent } from 'matrix-js-sdk';

  let message = ''

  function keydownSend(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send()
    }
  }

  async function send() {
    const msg = message
    message = ''

    try {
      await client.sendMessage(get(appState)!.selectedRoom!, {
        msgtype: "m.text",
        body: msg,
      })
      await new Promise(resolve => setTimeout(resolve, 0))
    } catch(e) {
      console.warn(e)
    }

    message = ''

  }

  function dedupeEvents(events: MatrixEvent[]): MatrixEvent[][] {
    let out: MatrixEvent[][] = []
    let currentSender: string | undefined = undefined

    events.forEach((e) => {
      if (e.getSender() !== currentSender) {
        currentSender = e.getSender()
        out.push([])
      }

      out[out.length - 1].push(e)
    })

    return out
  }

</script>

<div class="flex flex-row">
  <NavBar extraClass="sticky top-0 h-screen" on:routeSwitch={(room) => appState.setRoom(room.detail.roomId)}/>
  <div class="w-full h-screen overflow-y-auto relative2">
    <main class="py-2 w-full h-full overflow-x-hidden break-words flex flex-col-reverse">
      {#if $appState.selectedRoom}
        <form class="w-full sticky bottom-2 pt-8 flex flex-row gap-2 px-4" on:submit|preventDefault={send}>
          <textarea bind:value={message} on:keydown={keydownSend} placeholder="Message" class="text-black w-full resize-none" />
          <button type="submit">Send</button>
        </form>
        <div class="flex flex-col gap-2">
          {#each dedupeEvents($eventsStore ?? []) as events (events[0]?.getId())}
            <MessageEvent events={events} />
          {/each}
        </div>
      {/if}
    </main>
  </div>
</div>