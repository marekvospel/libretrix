import { writable } from "svelte/store"

export type Popup = DeviceVerificationPopup

export const currentPopup = writable<Popup | null>(null)

export function createPopup(popup: Popup) {
  currentPopup.set(popup)
}

// Popups

export interface DeviceVerificationPopup {
  type: "device-verification"
}