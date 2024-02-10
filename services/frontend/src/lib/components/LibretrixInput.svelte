<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  interface Events {
    keydown: KeyboardEvent
  }

  const dispatch = createEventDispatcher<Events>()

  export let id = ''
  export let value = ''
  export let type: 'text' | 'password' | 'textarea' = 'text'
  export let placeholder = ''
  export let error = false
  let className = ''

  export { className as class }
</script>

{#if type === 'text'}
  <input bind:value {placeholder} class="{error ? 'error' : ''} {className}" {id} />
{:else if type === 'password'}
  <input type="password" bind:value {placeholder} class="{error ? 'error' : ''} {className}" {id} />
{:else if type === 'textarea'}
  <textarea bind:value {placeholder} class="resize-none outline-none {error ? 'error' : ''} {className}" {id} on:keydown={(e) => dispatch('keydown', e)}/>
{/if}

<style>
  input, textarea {
    @apply px-2 py-1 rounded-xl;
    @apply bg-white bg-opacity-10;
    @apply border border-text-semilight border-opacity-40;
    @apply transition-colors duration-300;
  }

  input:focus-visible,
  textarea:focus-visible {
    @apply border-opacity-80;
  }

  input.error,
  textarea.error {
    @apply border-red;
  }
</style>