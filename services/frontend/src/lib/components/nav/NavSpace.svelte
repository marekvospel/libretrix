<script lang="ts">
export let name = ''
export let icon: string | undefined = undefined
export let image: string | undefined = undefined
export let href = '/app'

</script>

<a href={href} class="w-9 h-9 flex items-center justify-center bg-gray-800 rounded-lg overflow-hidden">
  {#if image}
    <img src={image} alt={name}>
  {:else if icon}
    <span class="block text-2xl {icon}"></span>
  {/if}

</a>