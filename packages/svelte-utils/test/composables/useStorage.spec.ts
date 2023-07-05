import { get } from "svelte/store"
import { useStorage } from "../../src"

describe('useStorage', () => {

  it('should load string from localStorage', () => {
    localStorage.setItem('test-1', 'hello')

    const store = useStorage('test-1', '', localStorage)
    expect(get(store)).toStrictEqual('hello')
  })

  it('should be default because value is missing', () => {
    const store = useStorage('test-2', undefined, localStorage)
    expect(get(store)).toStrictEqual(undefined)
  })

  it('should parse json from localStorage', () => {
    localStorage.setItem('test-3', JSON.stringify({ hello: 1, world: true }))

    const store = useStorage('test-3', {}, localStorage)
    expect(get(store)).toStrictEqual({
      hello: 1,
      world: true,
    })
  })

  it('should update using the set function', () => {
    const store = useStorage<string>('test-4', undefined, localStorage)

    expect(get(store)).toBeUndefined()
    store.set('Hello world')
    expect(get(store)).toStrictEqual('Hello world')
  })

  it('should update using the update function', () => {
    const store = useStorage('test-5', 'test', localStorage)

    expect(get(store)).toStrictEqual('test')
    store.update((value) => {
      expect(value).toStrictEqual('test')
      return 'hello'
    })
  })


  it('should be updated by other store', () => {
    const store = useStorage<object>('test-6', undefined, localStorage)
    const store2 = useStorage<object>('test-6', undefined, localStorage)

    expect(get(store)).toBeUndefined()
    expect(get(store2)).toBeUndefined()
    store.set({ test: true })
    expect(get(store)).toStrictEqual({ test: true })
    expect(get(store2)).toStrictEqual({ test: true })
  })

})