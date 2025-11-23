import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useReactiveSignal } from '../hooks/useReactiveSignal'
import { createSignal } from '../utils/createSignal'

describe('useReactiveSignal', () => {
  it('should subscribe to signal and return its value', () => {
    const $signal = createSignal(42)
    const { result } = renderHook(() => useReactiveSignal($signal))
    
    expect(result.current).toBe(42)
  })

  it('should update when signal value changes', () => {
    const $signal = createSignal(0)
    const { result } = renderHook(() => useReactiveSignal($signal))
    
    expect(result.current).toBe(0)
    
    act(() => {
      $signal.set(10)
    })
    
    expect(result.current).toBe(10)
  })

  it('should work with object signals', () => {
    const $signal = createSignal({ count: 0, name: 'test' })
    const { result } = renderHook(() => useReactiveSignal($signal))
    
    expect(result.current).toEqual({ count: 0, name: 'test' })
    
    act(() => {
      $signal.set((draft) => {
        draft.count = 5
      })
    })
    
    expect(result.current.count).toBe(5)
  })

  it('should work with array signals', () => {
    const $signal = createSignal([1, 2, 3])
    const { result } = renderHook(() => useReactiveSignal($signal))
    
    expect(result.current).toEqual([1, 2, 3])
    
    act(() => {
      $signal.set((draft) => {
        draft.push(4)
      })
    })
    
    expect(result.current).toEqual([1, 2, 3, 4])
  })

  it('should handle multiple sequential signal updates', () => {
    const $signal = createSignal(0)
    const { result } = renderHook(() => useReactiveSignal($signal))
    
    act(() => {
      $signal.set(5)
    })
    expect(result.current).toBe(5)
    
    act(() => {
      $signal.set(15)
    })
    expect(result.current).toBe(15)
    
    act(() => {
      $signal.set(30)
    })
    expect(result.current).toBe(30)
  })

  it('should work with nested object updates', () => {
    const $signal = createSignal({
      user: { name: 'John', age: 30 },
      settings: { theme: 'light' }
    })
    const { result } = renderHook(() => useReactiveSignal($signal))
    
    act(() => {
      $signal.set((draft) => {
        draft.user.age = 31
        draft.settings.theme = 'dark'
      })
    })
    
    expect(result.current.user.age).toBe(31)
    expect(result.current.settings.theme).toBe('dark')
  })

  it('should support multiple components subscribing to same signal', () => {
    const $signal = createSignal(100)
    
    const { result: result1 } = renderHook(() => useReactiveSignal($signal))
    const { result: result2 } = renderHook(() => useReactiveSignal($signal))
    
    expect(result1.current).toBe(100)
    expect(result2.current).toBe(100)
    
    act(() => {
      $signal.set(200)
    })
    
    expect(result1.current).toBe(200)
    expect(result2.current).toBe(200)
  })

  it('should handle signal created outside component', () => {
    const $globalSignal = createSignal('global')
    
    const { result } = renderHook(() => useReactiveSignal($globalSignal))
    
    expect(result.current).toBe('global')
    
    act(() => {
      $globalSignal.set('updated')
    })
    
    expect(result.current).toBe('updated')
  })

  it('should work with boolean signals', () => {
    const $signal = createSignal(false)
    const { result } = renderHook(() => useReactiveSignal($signal))
    
    expect(result.current).toBe(false)
    
    act(() => {
      $signal.set(true)
    })
    
    expect(result.current).toBe(true)
  })

  it('should work with string signals', () => {
    const $signal = createSignal('hello')
    const { result } = renderHook(() => useReactiveSignal($signal))
    
    expect(result.current).toBe('hello')
    
    act(() => {
      $signal.set('world')
    })
    
    expect(result.current).toBe('world')
  })

  it('should handle null and undefined values', () => {
    const $signal = createSignal(null)
    const { result } = renderHook(() => useReactiveSignal($signal))
    
    expect(result.current).toBe(null)
    
    act(() => {
      $signal.set(undefined)
    })
    
    expect(result.current).toBe(undefined)
    
    act(() => {
      $signal.set('value')
    })
    
    expect(result.current).toBe('value')
  })

  it('should handle complex nested updates', () => {
    const $signal = createSignal({
      users: [
        { id: 1, name: 'Alice', posts: [] },
        { id: 2, name: 'Bob', posts: [] }
      ]
    })
    const { result } = renderHook(() => useReactiveSignal($signal))
    
    act(() => {
      $signal.set((draft) => {
        const user = draft.users.find(u => u.id === 1)
        user.posts.push({ id: 101, title: 'First Post' })
        user.name = 'Alice Smith'
      })
    })
    
    expect(result.current.users[0].name).toBe('Alice Smith')
    expect(result.current.users[0].posts).toHaveLength(1)
  })

  it('should handle array operations', () => {
    const $signal = createSignal([
      { id: 1, done: false },
      { id: 2, done: true },
      { id: 3, done: false }
    ])
    const { result } = renderHook(() => useReactiveSignal($signal))
    
    act(() => {
      $signal.set((draft) => {
        const item = draft.find(item => item.id === 1)
        if (item) item.done = true
      })
    })
    
    expect(result.current[0].done).toBe(true)
  })

  it('should maintain reactivity across unmount/remount', () => {
    const $signal = createSignal(0)
    
    const { result, unmount } = renderHook(() => useReactiveSignal($signal))
    
    expect(result.current).toBe(0)
    
    act(() => {
      $signal.set(10)
    })
    
    expect(result.current).toBe(10)
    
    unmount()
    
    // Signal should still hold its value
    expect($signal.value).toBe(10)
    
    // Re-mount with same signal
    const { result: result2 } = renderHook(() => useReactiveSignal($signal))
    expect(result2.current).toBe(10)
  })

  it('should work with different signal instances', () => {
    const $signal1 = createSignal('A')
    const $signal2 = createSignal('B')
    
    const { result: result1 } = renderHook(() => useReactiveSignal($signal1))
    const { result: result2 } = renderHook(() => useReactiveSignal($signal2))
    
    expect(result1.current).toBe('A')
    expect(result2.current).toBe('B')
    
    act(() => {
      $signal1.set('A+')
    })
    
    expect(result1.current).toBe('A+')
    expect(result2.current).toBe('B')
  })

  it('should handle rapid successive updates', () => {
    const $signal = createSignal(0)
    const { result } = renderHook(() => useReactiveSignal($signal))
    
    act(() => {
      for (let i = 1; i <= 10; i++) {
        $signal.set(i)
      }
    })
    
    expect(result.current).toBe(10)
  })
})
