import { browser } from "$app/environment";
import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";
import { authStore } from "../../stores/auth.store";
import { get } from "svelte/store";
import { initClient } from "../../matrix";

export const load: LayoutLoad = async () => {

  if (!browser)
    return

  if ((!get(authStore).accessToken || !get(authStore).baseUrl)) {
    throw redirect(302, '/')
  }

  const startPromise = await initClient()

  return {
    startPromise
  }
}

export const ssr = false