import { ClientEvent, MatrixEventEvent, RoomEvent } from 'matrix-js-sdk'
import { createMatrixReadable } from '../matrix'
import { appState } from '$lib/app-state'

export const roomsStore = createMatrixReadable((client) => {
  return client.getRooms().sort((a, b) => b.getLastActiveTimestamp() - a.getLastActiveTimestamp())
}, {
  initialValue: [],
  events: [ClientEvent.Room, ClientEvent.DeleteRoom, RoomEvent.Name, RoomEvent.MyMembership, RoomEvent.Timeline],
})

export const eventsStore = createMatrixReadable((client, values) => {
  const timeline = client.getRoom(values.selectedRoom)?.getLiveTimeline()
  if (timeline)
    client.paginateEventTimeline(timeline, { backwards: true, limit: 30 })

  return timeline?.getEvents()
}, {
  initialValue: undefined,
  events: [RoomEvent.Timeline, MatrixEventEvent.Decrypted],
  dependencies: appState,
})
