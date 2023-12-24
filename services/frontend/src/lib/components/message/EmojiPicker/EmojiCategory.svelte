<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import emojis from 'emojibase-data/en/data.json'
  import groups from 'emojibase-data/meta/groups.json'

  const dispatch = createEventDispatcher()

  export let hiearchy: string = '0'

  let open = true
</script>

<details bind:open={open} data-group={hiearchy}>
  <summary class="marker:content-none flex flex-row gap-1 items-center text-subtext0 hover:text-text duration-300 transition-colors">
    <span class="i-bxs:smile inline-block" />
    <span>Category</span>
    <span class="i-bx:chevron-down inline-block {open ? '' : 'rotate-180'}"/>
  </summary>

  <div class="flex flex-row items-center flex-wrap gap-2 pt-2">
    {#each emojis.filter((e) => e.subgroup !== undefined && groups.hierarchy[hiearchy]?.includes(e.subgroup)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) as emoji}
      <button type="button" on:click={() => dispatch('emoji', emoji.emoji)}>
        <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@v14.0.2/assets/svg/{emoji.hexcode.toLowerCase()}.svg" class="block w-8 h-8 overflow-hidden" alt={emoji.emoji}>
      </button>
    {/each}
  </div>
</details>