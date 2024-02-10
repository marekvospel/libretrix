<script lang='ts'>
  import { EventStatus, type MatrixEvent } from 'matrix-js-sdk'
  import { date } from 'svelte-i18n'
  import { client, createMatrixReadable } from '$/matrix'
  import MessageImage from '$/lib/components/message/MessageImage.svelte'
  import MessageFormatted from '$/lib/components/message/MessageFormatted.svelte'
  import { appState } from '$/lib/app-state'

  export let events: MatrixEvent[]

  const sender = createMatrixReadable(client => events[0]?.getSender() ? client.getUser(events[0]?.getSender()!) : undefined, {
    initialValue: undefined,
  })

</script>

<div class='flex flex-row gap-4 w-full px-4 py-2'>
  <img
    src={$sender?.avatarUrl ? client.mxcUrlToHttp($sender?.avatarUrl) : undefined} alt={$sender?.displayName}
    class='w-12 h-12 aspect-square rounded-full overflow-hidden flex items-center justify-center bg-surface2 shrink-0'
  />
  <div class='flex-col w-full'>
    <p class='inline-flex items-center w-full'>
      <button class='font-500' type='button' on:click={() => appState.setUser($sender?.userId)}>{$sender?.displayName}</button>
      <span class='ml-auto text-subtext0'>{$date(events[0]?.getDate() ?? new Date(), {
        dateStyle: 'medium',
        timeStyle: 'short',
      })}</span>
    </p>

    {#each events as event (event.getId())}
      <div class='flex flex-row gap-2 items-center'>
        {#if (event.getAssociatedStatus() === null || event.getAssociatedStatus() === EventStatus.SENT) && (!event.event.content?.device_id || !client.checkDeviceTrust(event.getSender() ?? '', event.event.content?.device_id).isVerified())}
          <div class='shrink-0 text-xl text-red i-bx:shield' />
        {/if}
        <div class='mb-1'>
          {#if event.getType() === 'm.room.message'}
            <div class={event.getAssociatedStatus() && event.getAssociatedStatus() !== EventStatus.SENT ? 'text-subtext0' : ''}>
              {#if event.getContent().msgtype === 'm.text'}
                {#if event.getContent().format === 'org.matrix.custom.html'}
                  <MessageFormatted body={event.getContent().formatted_body} />
                {:else}
                  <MessageFormatted body={event.getContent().body} />
                {/if}
              {:else if event.getContent().msgtype === 'm.image'}
                <MessageImage file={event.getContent().file} alt={event.getContent().body} />
              {:else}
                {JSON.stringify(event.getContent())}
              {/if}
            </div>
          {:else if event.getType() === 'm.sticker'}
            {#if event.getContent().url}
              <img src={client.mxcUrlToHttp(event.getContent().url)} alt={event.getContent().body} />
            {/if}
          {:else}
            <p class='font-400 text-subtext0'>{event.getType()} {JSON.stringify(event.getContent())}</p>
          {/if}
        </div>
      </div>
    {/each}
  </div>

</div>
