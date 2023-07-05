import { useLocalStorage } from "@vospel/svelte-utils"

export interface AuthStore {
  accessToken: string
  deviceId: string
  userId: string
  baseUrl: string
}

export const authStore = useLocalStorage<Partial<AuthStore>>('matrix-secret', {})