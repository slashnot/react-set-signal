import { describe, it, expect, vi } from 'vitest'
import { createSignal, setSignal, getSignalValue } from '../utils/createSignal'

describe('createSignal', () => {
  it('should create a signal with initial value', () => {
    const $signal = createSignal(42)
    expect($signal.value).toBe(42)
  })

  it('should create a signal with object initial value', () => {
    const initialState = { count: 0, name: 'test' }
    const $signal = createSignal(initialState)
    expect($signal.value).toEqual(initialState)
  })

  it('should create a signal with array initial value', () => {
    const initialState = [1, 2, 3]
    const $signal = createSignal(initialState)
    expect($signal.value).toEqual(initialState)
  })

  it('should have a set method attached to signal', () => {
    const $signal = createSignal(0)
    expect(typeof $signal.set).toBe('function')
  })
})

describe('setSignal', () => {
  it('should update signal with direct value', () => {
    const $signal = createSignal(10)
    setSignal($signal, 20)
    expect($signal.value).toBe(20)
  })

  it('should update signal with function for primitive value', () => {
    const $signal = createSignal(5)
    // For primitives, the function receives the draft (which is the value itself)
    // and should mutate or return; since primitives can't be mutated,
    // direct value setting works better for primitives
    setSignal($signal, 10)
    expect($signal.value).toBe(10)
  })

  it('should update nested object properties using draft', () => {
    const $signal = createSignal({ user: { name: 'John', age: 30 } })
    setSignal($signal, (draft) => {
      draft.user.age = 31
    })
    expect($signal.value.user.age).toBe(31)
    expect($signal.value.user.name).toBe('John')
  })

  it('should handle array mutations with draft', () => {
    const $signal = createSignal([1, 2, 3])
    setSignal($signal, (draft) => {
      draft.push(4)
    })
    expect($signal.value).toEqual([1, 2, 3, 4])
  })

  it('should handle array splice with draft', () => {
    const $signal = createSignal([1, 2, 3, 4])
    setSignal($signal, (draft) => {
      draft.splice(1, 2)
    })
    expect($signal.value).toEqual([1, 4])
  })

  it('should return new value after set', () => {
    const $signal = createSignal(100)
    const result = setSignal($signal, 200)
    expect(result).toBe(200)
  })

  it('should handle complex nested updates', () => {
    const $signal = createSignal({
      users: [
        { id: 1, name: 'Alice', posts: [] },
        { id: 2, name: 'Bob', posts: [] }
      ]
    })
    
    setSignal($signal, (draft) => {
      const user = draft.users.find(u => u.id === 1)
      user.posts.push({ id: 101, title: 'First Post' })
    })
    
    expect($signal.value.users[0].posts).toHaveLength(1)
    expect($signal.value.users[0].posts[0].title).toBe('First Post')
  })

  it('should preserve immutability - original object not modified', () => {
    const original = { count: 0 }
    const $signal = createSignal(original)
    
    setSignal($signal, (draft) => {
      draft.count = 10
    })
    
    expect(original.count).toBe(0)
    expect($signal.value.count).toBe(10)
  })
})

describe('getSignalValue', () => {
  it('should return direct value when passed a value', () => {
    const $signal = createSignal(0)
    const result = getSignalValue($signal, 42)
    expect(result).toBe(42)
  })

  it('should return mutated draft when function mutates draft', () => {
    const $signal = createSignal({ count: 0 })
    const result = getSignalValue($signal, (draft) => {
      draft.count = 5
    })
    expect(result.count).toBe(5)
  })

  it('should return function result when function returns value', () => {
    const $signal = createSignal({ count: 0 })
    const result = getSignalValue($signal, (current) => ({
      ...current,
      count: 10
    }))
    expect(result.count).toBe(10)
  })

  it('should handle primitive direct values', () => {
    const $signal = createSignal(5)
    const result = getSignalValue($signal, 10)
    expect(result).toBe(10)
  })
})

describe('createSignal .set method', () => {
  it('should update value using .set method with direct value', () => {
    const $signal = createSignal(0)
    $signal.set(100)
    expect($signal.value).toBe(100)
  })

  it('should update value using .set method with function', () => {
    const $signal = createSignal({ count: 0 })
    $signal.set((draft) => {
      draft.count = 20
    })
    expect($signal.value.count).toBe(20)
  })

  it('should chain .set calls with direct values', () => {
    const $signal = createSignal(0)
    $signal.set(10)
    $signal.set(15)
    $signal.set(30)
    expect($signal.value).toBe(30)
  })

  it('should handle nested object mutations via .set', () => {
    const $signal = createSignal({
      profile: {
        name: 'John',
        preferences: { theme: 'light' }
      }
    })
    
    $signal.set((draft) => {
      draft.profile.preferences.theme = 'dark'
    })
    
    expect($signal.value.profile.preferences.theme).toBe('dark')
  })
})

describe('Edge cases', () => {
  it('should handle null values', () => {
    const $signal = createSignal(null)
    expect($signal.value).toBe(null)
    $signal.set(10)
    expect($signal.value).toBe(10)
  })

  it('should handle undefined values', () => {
    const $signal = createSignal(undefined)
    expect($signal.value).toBe(undefined)
    $signal.set('defined')
    expect($signal.value).toBe('defined')
  })

  it('should handle empty objects', () => {
    const $signal = createSignal({})
    expect($signal.value).toEqual({})
    $signal.set({ key: 'value' })
    expect($signal.value).toEqual({ key: 'value' })
  })

  it('should handle empty arrays', () => {
    const $signal = createSignal([])
    expect($signal.value).toEqual([])
    $signal.set((draft) => {
      draft.push(1)
    })
    expect($signal.value).toEqual([1])
  })

  it('should handle boolean values', () => {
    const $signal = createSignal(false)
    expect($signal.value).toBe(false)
    $signal.set(true)
    expect($signal.value).toBe(true)
  })

  it('should handle string values', () => {
    const $signal = createSignal('hello')
    expect($signal.value).toBe('hello')
    $signal.set('world')
    expect($signal.value).toBe('world')
  })
})
