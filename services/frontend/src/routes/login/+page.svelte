<script lang='ts'>
  import { InvalidUserIdError, UserId, wellKnownLookup } from '@vospel/matrix-utils'
  import { MatrixClient, createClient } from 'matrix-js-sdk'
  import { onMount } from 'svelte'
  import { get } from 'svelte/store'
  import { t } from 'svelte-i18n'

  import { authStore } from '$/stores/auth.store'
  import { goto } from '$app/navigation'
  import LibretrixContainer from '$/lib/components/LibretrixContainer.svelte'
  import LibretrixButton from '$/lib/components/LibretrixButton.svelte'
  import LibretrixInput from '$/lib/components/LibretrixInput.svelte'

  let servername: string = 'matrix.org'

  let username = ''
  let password = ''

  let error = 0

  $: {
    try {
      const userId = new UserId(username.trim())

      servername = userId.servername
    }
    catch (e) {
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
    }
    catch {
      user = username
    }

    let client: MatrixClient
    try {
      client = createClient({ baseUrl: await wellKnownLookup(servername) })
    }
    catch {
      return error = 1
    }

    try {
      const result = await client.login('m.login.password', {
        identifier: {
          type: 'm.id.user',
          user,
        },
        password,
        initial_device_display_name: `${window.location.host} | Libretrix`,
      })

      const baseUrl = result?.well_known?.['m.homeserver']?.base_url ?? client.baseUrl

      authStore.set({
        accessToken: result.access_token,
        deviceId: result.device_id,
        userId: result.user_id,
        baseUrl,
      })

      await goto('/')
    }
    catch (e: unknown) {
      if (typeof e !== 'object' || !e || !('errcode' in e))
        return

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
      await goto('/')
  })
</script>

<svelte:head>
  <title>{$t('auth.seo.title')}</title>
  <meta name='og:title' content={$t('auth.seo.title')} />
</svelte:head>

<LibretrixContainer class='isolate'>
  <form on:submit|preventDefault={login} class='flex flex-col gap-2 w-full max-w-100 mx-auto mt-[20dvh] p-8 border border-text-semilight border-opacity-40 rounded-xl relative bg-primary-900'>
    <div class='hidden sm:block absolute top-0 right-[-30%] w-100 h-100 rounded-full blur-350 bg-[#7CC2D8] bg-opacity-75 translate-y-[-30%] -z-10' />
    <div class='hidden sm:block absolute bottom-0 left-[-30%] w-100 h-100 rounded-full blur-350 bg-[#80C87E] bg-opacity-20 translate-y-[30%] -z-10' />
    <h1 class='text-2xl font-bold mb-8 flex items-center'>
      <img src='/favicon.svg' class='inline h-12 w-12 shrink-0' alt='Libretrix logo'>
      {$t('auth.title')}
    </h1>
    <div class='flex flex-col gap-1'>
      <label for='homeserver-input' class='text-sm text-text-semilight'>{$t('auth.homeserver')}</label>
      <LibretrixInput id='homeserver-input' bind:value={servername} type='text' placeholder={$t('auth.homeserver')} error={error === 1} />
      {#if error === 1}
        <span class='text-red leading-2'>{$t('auth.error.invalidHomeserver')}</span>
      {/if}
    </div>
    <br>
    <div class='flex flex-col gap-1'>
      <label for='username-input' class='text-sm text-text-semilight'>{$t('auth.username')}</label>
      <LibretrixInput id='username-input' bind:value={username} type='text' placeholder={$t('auth.username')} error={error === 2} />
      {#if error === 2}
        <span class='text-red leading-2'>{$t('auth.error.invalidUsername')}</span>
      {/if}
    </div>
    <div class='flex flex-col gap-1'>
      <label for='password-input' class='text-sm text-text-semilight'>{$t('auth.password')}</label>
      <LibretrixInput id='password-input' bind:value={password} type='password' placeholder={$t('auth.password')} error={error === 3} />
      {#if error === 3}
        <span class='text-red leading-2'>{$t('auth.error.invalidPassword')}</span>
      {/if}
    </div>
    <div class='h-8' />

    <LibretrixButton type='submit' color='primary'>
      <span class='text-center w-full'>{$t('auth.signIn')}</span>
    </LibretrixButton>
  </form>
</LibretrixContainer>

<div class='mt-auto px-4 py-1 text-gray'>
  <p>Attributions:</p>
  <ul>
    <li><a href='https://twemoji.twitter.com' target='_blank' rel='noreferrer noopener' class='underline'>Twemoji</a> by &copy; <a href='https://twemoji.twitter.com' target='_blank' rel='noreferrer noopener' class='underline'>Twitter, Inc and other contributors</a> used under the terms of CC-BY 4.0</li>
  </ul>
</div>
