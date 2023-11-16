<script lang="ts">
  import { UserEvent, type MatrixEvent } from 'matrix-js-sdk'
  import { createMatrixReadable } from '../../../matrix'
  import { client } from '../../../matrix'
  import { date } from 'svelte-i18n'
  import MessageImage from './MessageImage.svelte';

  export let event: MatrixEvent

  let sender = createMatrixReadable((client) => event.getSender() ? client.getUser(event.getSender()!) : undefined, 
  {
    initialValue: undefined,
    events: [UserEvent.DisplayName, UserEvent.AvatarUrl, UserEvent.Presence]
  })

</script>

<div class="flex flex-row gap-4 w-full bg-transparent hover:bg-gray-800 duration-300 transition-colors px-4 py-2">
    <img 
      src={$sender?.avatarUrl ? client.mxcUrlToHttp($sender?.avatarUrl) : undefined} alt="{$sender?.displayName}"
      class="w-12 h-12 aspect-square rounded-full overflow-hidden flex items-center justify-center bg-gray-600 shrink-0"
    />
  <div class="flex-col w-full">
    <p class="inline-flex items-center w-full">
      <span class="font-500">{$sender?.displayName}</span>
      <span class="ml-auto text-gray-600">{ $date(event.getDate() ?? new Date(), {
        dateStyle: 'medium',
        timeStyle: 'short'
      }) }</span>
    </p>

    {#if event.getType() === 'm.room.message'}
      {#if event.getContent().msgtype === 'm.text'}
        <!-- TODO: formatted body -->
        <p class="font-400 break-all">{ event.getContent().body }</p>
      {:else if event.getContent().msgtype === 'm.image'} 
        <MessageImage file={event.getContent().file} alt={event.getContent().body} />
      {:else}
        { JSON.stringify(event.getContent()) }
      {/if}
    {:else if event.getType() === 'm.sticker'}
      {#if event.getContent().url}
        <img src={client.mxcUrlToHttp(event.getContent().url)} alt={event.getContent().body} />
      {/if}
    {:else}
      <p class="font-400">{ event.getType() } { JSON.stringify(event.getContent()) }</p>
    {/if}
  </div>

</div>