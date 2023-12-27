<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import emojis from 'emojibase-data/en/data.json'
  import groups from 'emojibase-data/meta/groups.json'
  import text from 'emojibase-data/en/messages.json'

  const dispatch = createEventDispatcher()

  export let group: any = '0'

  let open = true
</script>

<details bind:open={open} data-group={group} class="pt-4">
  <summary class="marker:content-none flex flex-row gap-1 items-center text-subtext0 hover:text-text duration-300 transition-colors">
    <span class="inline-block text-xl {
      group == '0' ? 'i-bxs:smile' :
      group == '1' ? 'i-bxs:like' :
      group == '2' ? 'i-bxs:user' :
      group == '3' ? 'i-bxs:cat' :
      group == '4' ? 'i-bxs:pizza' :
      group == '5' ? 'i-bxs:home' :
      group == '6' ? 'i-bxs:bowling-ball' :
      group == '7' ? 'i-bxs:wrench' :
      group == '8' ? 'i-bxs:heart' :
      group == '9' ? 'i-bxs:flag' :
      ''
    }" />
    <span>{ text.groups[group].message }</span>
    <span class="i-bx:chevron-down inline-block {open ? '' : 'rotate-180'}"/>
  </summary>

  <div class="flex flex-row items-center flex-wrap gap-2 pt-2">
    {#each emojis.filter((e) => e.subgroup !== undefined && groups.hierarchy[group]?.includes(e.subgroup)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) as emoji}
      <button type="button" on:click={() => dispatch('emoji', emoji.emoji)} class="p-1 rounded transition-colors duration-300 bg-transparent hover:bg-surface2">
        <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@v14.0.2/assets/svg/{emoji.hexcode.toLowerCase()}.svg" class="block w-8 h-8 overflow-hidden" alt={emoji.emoji}>
      </button>
    {/each}
  </div>
</details>