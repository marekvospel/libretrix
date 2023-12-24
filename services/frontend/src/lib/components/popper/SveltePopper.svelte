<script lang="ts">
  import { computePosition } from '@floating-ui/dom'
  import { onMount, tick } from 'svelte';

  export let open = false

  let component: HTMLElement | undefined
  let tooltip: HTMLElement | undefined

  onMount(updatePosition)
  $: {
    open

    tick().then(() => {
      updatePosition()
    })
  }

  function updatePosition() {
    if (!component || !tooltip) return
    
    computePosition(component, tooltip, {
      placement: 'top',
      strategy: 'absolute',
    }).then((position) => {
      if (!tooltip) return

      tooltip.style.left = `min(${position.x}px, calc(100% - 1rem - ${tooltip.clientWidth}px)`
      tooltip.style.top = `calc(${position.y}px - 1rem)`
    })
  }

  function click(event: MouseEvent) {
    if (component && component.contains(event.target as Node)) return
    if (tooltip && tooltip.contains(event.target as Node)) return

    open = false
  }

</script>

<svelte:body on:click={click}/>

<div bind:this={component} on:click={() => open = !open} on:keypress={() => open = !open} role="button" tabindex="0">
  <slot open={open} />
</div>
{#if open}
  <div bind:this={tooltip} class="tooltip">
    <slot name="tooltip" />
  </div>
{/if}

<style>

.tooltip {
  @apply w-max absolute left-0 top-0 bg-surface1 rounded;
}

</style>