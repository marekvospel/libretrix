import { createMatrixReadable } from "../matrix"
import { ClientEvent, RoomEvent } from "matrix-js-sdk"

export const roomsStore = createMatrixReadable((client) => {
  return client.getRooms().sort((a, b) => b.getLastActiveTimestamp() - a.getLastActiveTimestamp())
}, {
  initialValue: [],
  events: [ClientEvent.Room, ClientEvent.DeleteRoom, RoomEvent.Name, RoomEvent.MyMembership, RoomEvent.Timeline]
})