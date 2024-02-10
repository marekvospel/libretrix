<script lang="ts">
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let type: "button" | "submit" | "reset" = "button"
  export let color: "primary" | "secondary" = "primary"

  let className = ''
  export { className as class }
</script>


<button on:click={() => dispatch('click')} type={type} class="{ 'color-' + color } {className}">
  <slot />
</button>

<style>
  button {
    @apply flex flex-row items-center gap-2;
    @apply px-2 py-1 rounded-xl border;
    @apply duration-300 transition-colors;
  }

  .color-primary {
    @apply bg-primary-500 text-text;
    @apply border-primary-400;
  }

  .color-primary:hover {
    @apply bg-primary-400;
  }

  .color-secondary {
    @apply bg-white bg-opacity-10 text-text;
    @apply border-white border-opacity-40;
  }

  .color-secondary:hover {
    @apply bg-opacity-20;
  }
</style>