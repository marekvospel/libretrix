<script lang="ts">
  import NavBar from '$lib/components/nav/NavBar.svelte'
  import { get } from 'svelte/store'
  import { client } from '../../matrix'
  import { eventsStore } from '../../stores/matrix.store'
  import MessageEvent from '$lib/components/message/MessageEvent.svelte'
  import { onMount } from 'svelte';
  import { appState } from '$lib/app-state';

  let message = ''
  let chatContainer: HTMLElement

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
      scrollToBottom()
    } catch(e) {
      console.warn(e)
    }

    message = ''

  }

  const scrollToBottom = async () => {
    await new Promise(resolve => setTimeout(resolve, 0))
    if (!chatContainer)
      return
    chatContainer.scrollTop = chatContainer.scrollHeight
  }
  
  onMount(() => {
    scrollToBottom()
  })

  $: {
    // Use the current room store so it gets updated when channel is changed
    $appState
    $eventsStore
    scrollToBottom()
  }
</script>

<div class="flex flex-row">
  <NavBar extraClass="sticky top-0 h-screen" on:routeSwitch={(room) => appState.setRoom(room.detail.roomId)}/>
  <div class="w-full h-screen overflow-y-auto relative2">
    <main bind:this={chatContainer} class="py-2 w-full h-full overflow-x-hidden break-words">
      {#if $appState.selectedRoom}
        <div class="flex flex-col gap-2">
          {#each $eventsStore ?? [] as event (event.getId())}
            <MessageEvent event={event} />
          {/each}
        </div>
        <form class="w-full sticky bottom-2 pt-8 flex flex-row gap-2 px-4" on:submit|preventDefault={send}>
          <textarea bind:value={message} on:keydown={keydownSend} placeholder="Message" class="text-black w-full resize-none" />
          <button type="submit">Send</button>
        </form>
      {/if}
    </main>
  </div>
</div>