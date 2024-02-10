<script lang='ts'>
  import { get } from 'svelte/store'
  import type { MatrixEvent } from 'matrix-js-sdk'

  import { VerificationRequestEvent } from 'matrix-js-sdk/lib/crypto-api'
  import { client } from '../../../matrix'
  import { eventsStore } from '../../../stores/matrix.store'
  import { startVerification } from '../../../matrix/verification'
  import { appState } from '$lib/app-state'

  import MessageEvent from '$lib/components/message/MessageEvent.svelte'
  import SveltePopper from '$lib/components/popper/SveltePopper.svelte'
  import EmojiPicker from '$lib/components/message/EmojiPicker.svelte'
  import LibretrixInput from '$/lib/components/LibretrixInput.svelte'

  let message = ''

  function keydownSend(event: CustomEvent<KeyboardEvent>) {
    if (event.detail.key === 'Enter' && !event.detail.shiftKey) {
      event.preventDefault()
      send()
    }
  }

  async function send() {
    const msg = message
    message = ''

    if (msg.trim() === '')
      return

    try {
      await client.sendMessage(get(appState)!.selectedRoom!, {
        msgtype: 'm.text',
        body: msg,
      })
      await new Promise(resolve => setTimeout(resolve, 0))
    }
    catch (e) {
      console.warn(e)
    }

    message = ''
  }

  function dedupeEvents(events: MatrixEvent[]): MatrixEvent[][] {
    const out: MatrixEvent[][] = []
    let currentSender: string | undefined

    events.forEach((e) => {
      if (e.getSender() !== currentSender) {
        currentSender = e.getSender()
        out.push([])
      }

      out[out.length - 1].push(e)
    })

    return out
  }

  async function verifyUser(user: string) {
    const req = await client.requestVerification(user)

    req.on(VerificationRequestEvent.Change, async () => {
      await startVerification(client, req)
    })

    await req.accept()
  }
</script>

{#if $appState.selectedRoom}
  <div class='h-full w-full overflow-x-hidden break-words flex flex-col-reverse'>
    <form class='w-full sticky bottom-0 flex px-4 py-4 bg-primary-900 z-10 isolate' on:submit|preventDefault={send}>
      <div class='w-full flex flex-row items-center gap-2 p-2'>
        <LibretrixInput type='textarea' bind:value={message} on:keydown={keydownSend} placeholder='Message' class='w-full h-[2.25em]' />
        <SveltePopper let:open>
          <button type='button' class="aspect-square flex flex-row items-center filter-grayscale focus-visible:filter-grayscale-0 hover:filter-grayscale-0 transition-all duration-300 {open ? '!filter-grayscale-0' : ''}">
            <span class='inline-block i-twemoji:face-with-tears-of-joy text-xl' />
          </button>
          <EmojiPicker slot='tooltip' on:emoji={emoji => message += emoji.detail} />
        </SveltePopper>
        <button type='submit' class='flex flex-row items-center hover:text-primary focus:text-primary transition-colors duration-300'>
          <span class='inline-block i-bx:send text-2xl' />
        </button>
      </div>
    </form>
    <div class='flex flex-col gap-2'>
      {#each dedupeEvents($eventsStore ?? []) as events (events[0]?.getId())}
        <MessageEvent events={events} />
      {/each}
    </div>
  </div>
  {#if $appState.selectedUser}
    <div class='h-full w-full max-w-80 bg-surface0 overflow-hidden break-all flex flex-col items-center'>
      <p>{$appState.selectedUser}</p>
      {#if client.checkUserTrust($appState.selectedUser).isVerified()}
        <span class='text-4xl block i-bxs:shield text-green' />
      {:else}
        <span class='text-4xl block i-bx:shield text-red' />
        <button on:click={() => verifyUser($appState.selectedUser ?? '')}>Verify user</button>
      {/if}
      <div>
        {#each client.getStoredDevicesForUser($appState.selectedUser) ?? [] as device}
          <div class='flex flex-row items-center gap-2'>

            {#if client.checkDeviceTrust($appState.selectedUser, device.deviceId).isVerified()}
              <span class='block i-bxs:shield text-green' />
            {:else}
              <span class='block i-bx:shield text-red' />
            {/if}
            <p>{device.getDisplayName() ?? device.deviceId}</p>
          </div>
        {/each}
      </div>
    </div>
  {/if}
{:else}
  <h2 class='text-xl'>No room selected</h2>
{/if}
