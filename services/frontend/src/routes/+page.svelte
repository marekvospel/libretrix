<script lang="ts">
  import { UserId, wellKnownLookup, InvalidUserIdError } from '@vospel/matrix-utils'
  import { createClient } from 'matrix-js-sdk'
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';

  import { authStore } from '../stores/auth.store'
  
  let servername: string = 'matrix.org'

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

  async function login() {
    let user

    try {
      const userId = new UserId(username.trim())

      user = userId.localpart
    } catch {
      user = username
    }

    const client = createClient({ baseUrl: await wellKnownLookup(servername) })
   
    try {
      const result = await client.login('m.login.password', {
        identifier: {
          type: 'm.id.user',
          user,
        },
        password,
        initial_device_display_name: 'My custom matrix client'
      })

      const baseUrl = result?.well_known?.['m.homeserver']?.base_url ?? client.baseUrl

      authStore.set({
        accessToken: result.access_token,
        deviceId: result.device_id,
        userId: result.user_id,
        baseUrl,
      })
      
      await goto('/app')
    } catch {}
  }

  onMount(async () => {
    if (get(authStore).accessToken)
      await goto('/app')
  })
</script>

<form on:submit|preventDefault={login} class="flex flex-col gap-2 max-w-100 m-auto py-8">
  <input bind:value={servername} type="text" class="bg-gray-700 rounded px-2 py-1" placeholder="Homeserver">
  <br>
  <input bind:value={username} type="text" class="bg-gray-700 rounded px-2 py-1" placeholder="Username">
  <input bind:value={password} type="password" class="bg-gray-700 rounded px-2 py-1" placeholder="Password">

  <button type="submit" class="bg-cyan-500 py-1 rounded">Sign in</button>
</form>