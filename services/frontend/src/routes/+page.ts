import { redirect } from '@sveltejs/kit'
import { get } from 'svelte/store'

import { authStore } from '../stores/auth.store'
import { initClient } from '../matrix'
import type { PageLoad } from './$types'
import { browser } from '$app/environment'

export const load: PageLoad = async () => {
  if (!browser) {
    return {
      startPromise: new Promise(reject => reject('ssr')),
    }
  }

  if (!get(authStore).accessToken || !get(authStore).baseUrl)
    throw redirect(302, '/login')

  const startPromise = await initClient()

  return {
    startPromise,
  }
}
