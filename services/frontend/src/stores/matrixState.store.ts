import { writable } from 'svelte/store'
import type { SyncState } from 'matrix-js-sdk/lib/sync'

export const stateStore = writable<SyncState | null>(null)
