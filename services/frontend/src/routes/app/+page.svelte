<script lang="ts">
  import NavBar from '$lib/components/nav/NavBar.svelte'
    import { client } from '../../matrix';

  let currentRoom: string | undefined = undefined
  let message = ''

  async function send() {
    try {
      console.log(client.getCrypto()?.globalBlacklistUnverifiedDevices)
      await client.sendMessage(currentRoom!, {
        msgtype: "m.text",
        body: message,
      })
    } catch(e) {
      console.warn(e)
    }

    message = ''

  }
</script>

<div class="flex flex-row">
  <NavBar extraClass="sticky top-0 h-screen" on:routeSwitch={(room) => currentRoom = room.detail.roomId}/>
  <main class="px-4 py-2">
    <p>{ currentRoom }</p>

    {#if currentRoom}
    <form on:submit|preventDefault={send}>
      <textarea bind:value={message} placeholder="Message" />
      <button type="submit">Send</button>
    </form>
    {/if}
  </main>
</div>
