import { readable, writable } from "svelte/store";
import type{ SyncState } from "matrix-js-sdk/lib/sync";
import { client } from "../matrix";
import { ClientEvent, Room, RoomEvent } from "matrix-js-sdk";

export const stateStore = writable<SyncState | null>(null)

export const roomsStore = readable<Room[]>([], (set) => {

  function getRooms() {
    return client.getRooms().sort((a, b) => b.getLastActiveTimestamp() - a.getLastActiveTimestamp())
  }

  function updateRooms() {
    set(getRooms())
  }

  client.on(ClientEvent.Room, updateRooms)
  client.on(ClientEvent.DeleteRoom, updateRooms)
  client.on(RoomEvent.Name, updateRooms)
  client.on(RoomEvent.MyMembership, updateRooms)
  client.on(RoomEvent.Timeline, updateRooms)

  set(getRooms())

  return () => {
    client.off(ClientEvent.Room, updateRooms)
    client.off(ClientEvent.DeleteRoom, updateRooms)
    client.off(RoomEvent.Name, updateRooms)
    client.off(RoomEvent.MyMembership, updateRooms)
    client.off(RoomEvent.Timeline, updateRooms)
  }
})