<script lang="ts">
  import NavBar from '$lib/components/nav/NavBar.svelte'
  import { get } from 'svelte/store'
  import { client } from '../../matrix'
  import { eventsStore } from '../../stores/matrix.store'
  import MessageEvent from '$lib/components/message/MessageEvent.svelte'
  import { appState } from '$lib/app-state';
  import type { MatrixEvent } from 'matrix-js-sdk';
  import SveltePopper from '$lib/components/popper/SveltePopper.svelte';
  import EmojiPicker from '$lib/components/message/EmojiPicker.svelte';
  import SettingsPage from './pages/SettingsPage.svelte';

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

    if (msg.trim() === '') return

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
  <NavBar extraClass="sticky top-0 h-screen" on:routeSwitch={(event) => { appState.setRoute(event.detail.route ?? $appState.route); if (event.detail.roomId) appState.setRoom(event.detail.roomId) }}/>
  <div class="w-full h-screen overflow-y-auto relative2">
    <main class="pt-2 w-full h-full">
      {#if $appState.route === 'room' }
        {#if $appState.selectedRoom }
          <div class="h-full w-full overflow-x-hidden break-words flex flex-col-reverse">
            <form class="w-full sticky bottom-0 flex px-4 py-4 bg-base" on:submit|preventDefault={send}>
              <div class="w-full flex flex-row gap-2 bg-surface0 border border-surface1 rounded-xl p-2">
                <textarea bind:value={message} on:keydown={keydownSend} placeholder="Message" class="w-full resize-none bg-transparent border-none h-[1.5em] outline-none" />
                <SveltePopper let:open>
                  <button type="button" class="aspect-square flex flex-row items-center filter-grayscale focus-visible:filter-grayscale-0 hover:filter-grayscale-0 transition-all duration-300 { open ? '!filter-grayscale-0' : ''}">
                    <span class="inline-block i-twemoji:face-with-tears-of-joy text-xl" />
                  </button>
                  <EmojiPicker slot="tooltip" on:emoji={(emoji) => message += emoji.detail } />
                </SveltePopper>
                <button type="submit" class="flex flex-row items-center hover:text-teal focus:text-teal transition-colors duration-300">
                  <span class="inline-block i-bx:send text-2xl" />
                </button>
              </div>
            </form>
            <div class="flex flex-col gap-2">
              {#each dedupeEvents($eventsStore ?? []) as events (events[0]?.getId())}
                <MessageEvent events={events} />
              {/each}
            </div>
          </div>
        {:else}
          <h2 class="text-xl">No room selected</h2>
        {/if}
      {:else if $appState.route == 'settings'}
        <SettingsPage />
      {/if}
    </main>
  </div>
</div>