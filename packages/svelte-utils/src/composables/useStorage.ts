import { Updater, Writable, readable } from "svelte/store"

const isClient = typeof window !== 'undefined'
const defaultWindow = isClient ? window : undefined

export interface CustomStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export interface CustomStorageEvent {
  storageArea: CustomStorage | null,
  key: StorageEvent['key'],
  oldValue: StorageEvent['oldValue'],
  newValue: StorageEvent['newValue'],
}

export function useStorage<T>(key: string, defaults: undefined, storage?: CustomStorage): Writable<T>
export function useStorage<T>(key: string, defaults: T, storage?: CustomStorage): Writable<T>

export function useStorage<T>(key: string, defaults: T, storage?: CustomStorage): Writable<T> {
  const window = defaultWindow

  function serialize(value: unknown): string {
    switch (typeof defaults) {
      case 'string':
      case 'boolean':
      case 'number':
        return String(value)
      default:
        return JSON.stringify(value)
    }
  }

  function deserialize(value: string): unknown {
    switch(typeof defaults) {
      case 'string':
        return value
      case 'boolean':
        return value === 'true'
      default:
        return JSON.parse(value)
    }
  }

  function read(): T {
    const value = storage!.getItem(key)

    if (value === null)
      return defaults

    // TODO: merge defaults
    return deserialize(value) as T
  }

  function write(value: T) {
      const oldValue = storage!.getItem(key)
      const newValue = serialize(value)
      storage!.setItem(key, newValue)

      window?.dispatchEvent(new CustomEvent<CustomStorageEvent>('custom-storage', {
        detail: {
          key,
          oldValue,
          newValue,
          storageArea: storage!
        }
      }))
  }

  const store = readable<T>(defaults, (set) => {
      /* c8 ignore start */
      const listener = (event?: CustomStorageEvent) => {
        if (event?.storageArea === storage && event?.key === key) {
          set(read())
        }
      }
      const customListener = (event: CustomEvent<CustomStorageEvent>) => {
        listener(event.detail)
      }
      /* c8 ignore end */

      window?.addEventListener('storage', listener)
      // @ts-expect-error: custom-storage doesnt't exist in the WindowEventMap
      window?.addEventListener('custom-storage', customListener)

      if (storage) {
        set(read())
      }

      return () => {
        window?.removeEventListener('storage', listener)
        // @ts-expect-error: custom-storage doesnt't exist in the WindowEventMap
        window?.removeEventListener('custom-storage', customListener)
      }
    })

  return {
    ...store,
    set(value: T) {
      write(value)
    },
    update(updater: Updater<T>) {
      write(updater(read()))
    }
  }
}

export function useLocalStorage<T>(key: string, defaults: undefined): Writable<T>
export function useLocalStorage<T>(key: string, defaults: T): Writable<T>

export function useLocalStorage<T>(key: string, defaults: undefined): Writable<T> {
  return useStorage(key, defaults, isClient ? localStorage : undefined)
}