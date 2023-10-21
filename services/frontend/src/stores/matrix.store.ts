import { writable } from 'svelte/store'
import { createMatrixReadable } from '../matrix'
import { ClientEvent, MatrixEventEvent, RoomEvent } from 'matrix-js-sdk'

export const currentRoomStore = writable<string | undefined>(undefined)

export const roomsStore = createMatrixReadable((client) => {
  return client.getRooms().sort((a, b) => b.getLastActiveTimestamp() - a.getLastActiveTimestamp())
}, {
  initialValue: [],
  events: [ClientEvent.Room, ClientEvent.DeleteRoom, RoomEvent.Name, RoomEvent.MyMembership, RoomEvent.Timeline],
})

export const eventsStore = createMatrixReadable((client, values) => {
  return client.getRoom(values)?.getLiveTimeline().getEvents()
}, {
  initialValue: undefined,
  events: [RoomEvent.Timeline],
  dependencies: currentRoomStore,
})