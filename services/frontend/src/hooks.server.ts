import type { Handle } from '@sveltejs/kit'
import { locale } from 'svelte-i18n'
import { browser } from '$app/environment'

export const handle: Handle = async ({ event, resolve }) => {
  if (browser)
    locale.set(window.navigator.language)

  return await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%unocss-svelte-scoped.global%', 'unocss_svelte_scoped_global_styles'),
  })
}
