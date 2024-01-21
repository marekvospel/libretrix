import { readable } from 'svelte/store'

export type AppRoutes = 'room' | 'settings'

export class AppState<Routes extends string = AppRoutes> {
  route: Routes
  selectedRoom?: string
  selectedUser?: string

  constructor(route: Routes) {
    this.route = route
  }
}

export const appState = (() => {
  const appState = new AppState<AppRoutes>('room')
  let setter: (value: AppState) => void
  const store = readable(appState, (set) => {
    setter = set
  })

  return {
    subscribe: store.subscribe,
    setRoute(route: AppRoutes) {
      appState.route = route
      setter(appState)
    },
    setRoom(room: string) {
      appState.selectedRoom = room
      appState.selectedUser = undefined
      setter(appState)
    },
    setUser(user: string | undefined) {
      appState.selectedUser = user
      setter(appState)
    },
  }
})()
