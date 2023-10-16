<script lang="ts">
  import type { PageData } from "./$types"
  import NavBar from "$lib/components/nav/NavBar.svelte"

  let data: PageData

</script>

<div class="flex flex-row">
  <NavBar extraClass="sticky top-0 h-screen" />
  <main class="px-4 py-2">
    <p>abc</p>
  </main>
</div>