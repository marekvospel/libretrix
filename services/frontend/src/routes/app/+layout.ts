import { browser } from "$app/environment";
import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";
import { authStore } from "../../stores/auth.store";
import { get } from "svelte/store";

export const load: LayoutLoad = () => {

  if (browser && (!get(authStore).accessToken || !get(authStore).baseUrl)) {
    throw redirect(302, '/')
  }
}

export const ssr = false