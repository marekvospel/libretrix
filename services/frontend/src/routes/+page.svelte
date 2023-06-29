<script lang="ts">
  let username = ''
  let password = ''

</script>

<form on:submit|preventDefault>
  <input bind:value={username} type="text" class="bg-gray-700" placeholder="Username">
  <input bind:value={password} type="password" class="bg-gray-700" placeholder="Password">
</form>