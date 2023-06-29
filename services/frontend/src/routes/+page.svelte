<script lang="ts">
  import { UserId, InvalidUserIdError } from '@vospel/matrix-utils'

  let servername: string | undefined = 'matrix.org'

  let username = ''
  let password = ''

  $: {
    try {
      const userId = new UserId(username.trim())

      servername = userId.servername
    } catch(e) {

      if (e instanceof InvalidUserIdError) {
        if (e.servername)
          servername = e.servername
      }

    }
  }
</script>

<form on:submit|preventDefault class="flex flex-col gap-2 max-w-100 m-auto py-8">
  <input bind:value={servername} type="text" class="bg-gray-700 rounded px-2 py-1" placeholder="Homeserver">
  <br>
  <input bind:value={username} type="text" class="bg-gray-700 rounded px-2 py-1" placeholder="Username">
  <input bind:value={password} type="password" class="bg-gray-700 rounded px-2 py-1" placeholder="Password">

  <button type="submit" class="bg-cyan-400 py-1 rounded">Sign in</button>
</form>