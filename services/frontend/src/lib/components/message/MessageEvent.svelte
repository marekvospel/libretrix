<script lang="ts">
  import type { MatrixEvent } from 'matrix-js-sdk'
  import { createMatrixReadable } from '../../../matrix'
  import { client } from '../../../matrix'
  import { date } from 'svelte-i18n'
  import MessageImage from './MessageImage.svelte';
  import MessageFormatted from './MessageFormatted.svelte';

  export let events: MatrixEvent[]

  let sender = createMatrixReadable((client) => events[0]?.getSender() ? client.getUser(events[0]?.getSender()!) : undefined,
  {
    initialValue: undefined,
  })

</script>

<div class="flex flex-row gap-4 w-full px-4 py-2">
  <img
    src={$sender?.avatarUrl ? client.mxcUrlToHttp($sender?.avatarUrl) : undefined} alt="{$sender?.displayName}"
    class="w-12 h-12 aspect-square rounded-full overflow-hidden flex items-center justify-center bg-surface2 shrink-0"
  />
  <div class="flex-col w-full">
    <p class="inline-flex items-center w-full">
      <span class="font-500">{$sender?.displayName}</span>
      <span class="ml-auto text-subtext0">{ $date(events[0]?.getDate() ?? new Date(), {
        dateStyle: 'medium',
        timeStyle: 'short'
      }) }</span>
    </p>

    {#each events as event (event.getId())}
      <div class="mb-1">
        {#if event.getType() === 'm.room.message'}
          {#if event.getContent().msgtype === 'm.text'}
            <!-- TODO: formatted body -->
            {#if event.getContent().format === 'org.matrix.custom.html'}
              <MessageFormatted body={event.getContent().formatted_body} />
            {:else}
              <p class="font-400 break-all">{ event.getContent().body }</p>
            {/if}
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
    {/each}
  </div>

</div>