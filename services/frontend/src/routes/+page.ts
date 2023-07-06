import type { PageLoad } from "./$types"
import { browser } from "$app/environment"
import { redirect } from "@sveltejs/kit"
import { get } from "svelte/store"

import { authStore } from "../stores/auth.store"

export const load: PageLoad = () => {
  if (browser && get(authStore).accessToken) {
    throw redirect(302, '/app')
  }
}