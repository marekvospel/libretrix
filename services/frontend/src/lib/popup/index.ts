import type { ShowSasCallbacks } from 'matrix-js-sdk/lib/crypto-api'
import { writable } from 'svelte/store'

export type Popup = DeviceVerificationPopup

export const currentPopup = writable<Popup | null>(null)

export function createPopup(popup: Popup) {
  currentPopup.set(popup)
}

export function clearPopup() {
  currentPopup.set(null)
}

// Popups

export interface DeviceVerificationPopup {
  type: 'device-verification'
  sas: ShowSasCallbacks
}
