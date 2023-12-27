<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import EmojiCategory from "./EmojiPicker/EmojiCategory.svelte";
  import groups from 'emojibase-data/meta/groups.json'
    import { number } from "svelte-i18n";

  const dispatch = createEventDispatcher()

  let container: HTMLElement
  let currentGroup = '0'

  function scrollToGroup(group: string) {
    container.querySelector(`[data-group="${group}"]`)?.scrollIntoView({ behavior: 'smooth' })
  }

  onMount(() => {
    container.addEventListener('scroll', () => {
      const titles = Array.from(container.querySelectorAll('[data-group]'))
      currentGroup = titles.find((title) => title.getBoundingClientRect().top > 0)?.getAttribute('data-group') ?? Object.keys(groups.groups)[Object.keys(groups.groups).length - 1]
    })
  })
</script>

<div class="flex flex-row gap-4 w-full max-h-75 overflow-y-auto relative rounded" bind:this={container}>
  <div class="flex flex-col items-center gap-2 bg-surface2 h-full max-h-75 px-2 py-4 sticky top-0 overflow-y-auto">
    {#each Object.keys(groups.groups) as group}
      <button type="button" on:click={() => scrollToGroup(group)} class="flex items-center justify-center w-full h-full p-1 rounded transition-colors duration-300 {currentGroup === group ? 'bg-surface1' : ''} hover:bg-surface1">
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
      </button>
    {/each}
  </div>
  <div class="flex-col gap-8 w-full max-w-75">
    {#each Object.keys(groups.groups) as group}
      <EmojiCategory group={group} on:emoji={(emoji) => dispatch('emoji', emoji.detail)}/>
    {/each}
  </div>
</div>