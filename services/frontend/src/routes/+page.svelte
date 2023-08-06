<script lang="ts">
  import { UserId, wellKnownLookup, InvalidUserIdError } from '@vospel/matrix-utils'
  import { MatrixClient, createClient } from 'matrix-js-sdk'
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';
  import { t } from 'svelte-i18n'

  import { authStore } from '../stores/auth.store'

  let servername: string = 'matrix.org'

  let username = ''
  let password = ''

  let error = 0

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

    error = 0

    try {
      const userId = new UserId(username.trim())

      user = userId.localpart
    } catch {
      user = username
    }

    let client: MatrixClient
    try {
      client = createClient({ baseUrl: await wellKnownLookup(servername) })
    } catch {
      return error = 1
    }
   
    try {
      const result = await client.login('m.login.password', {
        identifier: {
          type: 'm.id.user',
          user,
        },
        password,
        initial_device_display_name: 'Libretrix'
      })

      const baseUrl = result?.well_known?.['m.homeserver']?.base_url ?? client.baseUrl

      authStore.set({
        accessToken: result.access_token,
        deviceId: result.device_id,
        userId: result.user_id,
        baseUrl,
      })
      
      await goto('/app')
    } catch(e: unknown) {

      if (typeof e !== 'object' || !e || !('errcode' in e)) return
      
      switch (e?.errcode) {
        case 'M_UNKNOWN':
          error = 2
        break
        default: 
          error = 3
        break
      }

    }
  }

  onMount(async () => {
    if (get(authStore).accessToken)
      await goto('/app')
  })
</script>

<svelte:head>
  <title>{ $t('auth.seo.title') }</title>
  <meta name="og:title" content="{ $t('auth.seo.title')}" />
</svelte:head>

<form on:submit|preventDefault={login} class="flex flex-col gap-2 max-w-100 m-auto py-8">
  <h1 class="text-2xl font-bold mb-8">{ $t('auth.title') }</h1>
  <input bind:value={servername} type="text" class="bg-gray-700 rounded px-2 py-1 border border-transparent { error === 1 ? '!border-red-600' : '' }" placeholder={$t('auth.homeserver')}>
  {#if error === 1}
    <span class="text-red-600 leading-2">{ $t('auth.error.invalidHomeserver') }</span>
  {/if}
  <br>
  <input bind:value={username} type="text" class="bg-gray-700 rounded px-2 py-1 border border-transparent { error === 2 || error === 3 ? '!border-red-600' : '' }" placeholder={$t('auth.username')}>
  {#if error === 2}
    <span class="text-red-600 leading-2">{ $t('auth.error.invalidUsername') }</span>
  {/if}
  <input bind:value={password} type="password" class="bg-gray-700 rounded px-2 py-1 border border-transparent { error === 3 ? '!border-red-600' : '' }" placeholder={$t('auth.password')}>
  {#if error === 3}
    <span class="text-red-600 leading-2">{ $t('auth.error.invalidPassword') }</span>
  {/if}

  <button type="submit" class="bg-cyan-500 py-1 rounded">{ $t('auth.signIn') }</button>
</form>