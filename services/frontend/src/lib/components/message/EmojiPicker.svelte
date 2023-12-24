<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import EmojiCategory from "./EmojiPicker/EmojiCategory.svelte";
  import groups from 'emojibase-data/meta/groups.json'

  const dispatch = createEventDispatcher()

  let container: HTMLElement

  function scrollToGroup(group: string) {
    container.querySelector(`[data-group="${group}"]`)?.scrollIntoView({ behavior: 'smooth' })
  }
</script>

<div class="flex flex-row gap-4 w-full max-h-75 overflow-y-auto relative rounded" bind:this={container}>
  <div class="flex flex-col items-center gap-6 bg-surface2 h-full max-h-75 px-2 py-4 sticky top-0 overflow-y-auto">
    {#each Object.keys(groups.groups) as group}
      <button type="button" on:click={() => scrollToGroup(group)} class="flex items-center justify-center w-full h-full">
        <span class="inline-block i-bxs:smile text-xl" />
      </button>
    {/each}
  </div>
  <div class="flex-col gap-8 w-full max-w-75">
    {#each Object.keys(groups.groups) as group}
      <EmojiCategory hiearchy={group} on:emoji={(emoji) => dispatch('emoji', emoji.detail)}/>
    {/each}
  </div>
</div>