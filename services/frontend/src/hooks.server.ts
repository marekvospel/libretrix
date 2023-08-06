import { browser } from "$app/environment"
import type { Handle } from "@sveltejs/kit"
import { locale } from "svelte-i18n"

export const handle: Handle = async ({ event, resolve }) => {
  if (browser) {
		locale.set(window.navigator.language)
	}
  return await resolve(event)
}