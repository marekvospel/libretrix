<script lang="ts">
  let className = ''
  export { className as class }
</script>

<div class="w-full sm:max-w-125 md:max-w-175 lg:max-w-225 xl:max-w-300 2xl:max-w-375 m-x-auto px-4 {className}">
  <slot />
</div>