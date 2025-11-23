import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useReactive } from '../hooks/useReactive'

describe('useReactive', () => {
  it('should initialize with primitive value', () => {
    const { result } = renderHook(() => useReactive(0))
    const [state] = result.current
    expect(state).toBe(0)
  })

  it('should initialize with object value', () => {
    const initialState = { count: 0, name: 'test' }
    const { result } = renderHook(() => useReactive(initialState))
    const [state] = result.current
    expect(state).toEqual(initialState)
  })

  it('should initialize with array value', () => {
    const initialState = [1, 2, 3]
    const { result } = renderHook(() => useReactive(initialState))
    const [state] = result.current
    expect(state).toEqual(initialState)
  })

  it('should update state with direct value', () => {
    const { result } = renderHook(() => useReactive(0))
    
    act(() => {
      const [, setState] = result.current
      setState(10)
    })
    
    const [state] = result.current
    expect(state).toBe(10)
  })

  it('should update state with direct value for primitives', () => {
    const { result } = renderHook(() => useReactive(5))
    
    act(() => {
      const [, setState] = result.current
      setState(10)
    })
    
    const [state] = result.current
    expect(state).toBe(10)
  })

  it('should handle object mutations using draft', () => {
    const { result } = renderHook(() => useReactive({ count: 0, name: 'test' }))
    
    act(() => {
      const [, setState] = result.current
      setState((draft) => {
        draft.count = 5
      })
    })
    
    const [state] = result.current
    expect(state.count).toBe(5)
    expect(state.name).toBe('test')
  })

  it('should handle array mutations using draft', () => {
    const { result } = renderHook(() => useReactive([1, 2, 3]))
    
    act(() => {
      const [, setState] = result.current
      setState((draft) => {
        draft.push(4)
      })
    })
    
    const [state] = result.current
    expect(state).toEqual([1, 2, 3, 4])
  })

  it('should handle nested object updates', () => {
    const { result } = renderHook(() => 
      useReactive({ 
        user: { name: 'John', age: 30 },
        settings: { theme: 'light' }
      })
    )
    
    act(() => {
      const [, setState] = result.current
      setState((draft) => {
        draft.user.age = 31
        draft.settings.theme = 'dark'
      })
    })
    
    const [state] = result.current
    expect(state.user.age).toBe(31)
    expect(state.settings.theme).toBe('dark')
  })

  it('should handle multiple sequential updates', () => {
    const { result } = renderHook(() => useReactive(0))
    
    act(() => {
      const [, setState] = result.current
      setState(5)
    })
    
    act(() => {
      const [, setState] = result.current
      setState(15)
    })
    
    act(() => {
      const [, setState] = result.current
      setState(30)
    })
    
    const [state] = result.current
    expect(state).toBe(30)
  })

  it('should handle array splice operations', () => {
    const { result } = renderHook(() => useReactive([1, 2, 3, 4, 5]))
    
    act(() => {
      const [, setState] = result.current
      setState((draft) => {
        draft.splice(1, 2)
      })
    })
    
    const [state] = result.current
    expect(state).toEqual([1, 4, 5])
  })

  it('should handle array filter-like operations with splice', () => {
    const { result } = renderHook(() => 
      useReactive([
        { id: 1, done: false },
        { id: 2, done: true },
        { id: 3, done: false }
      ])
    )
    
    act(() => {
      const [, setState] = result.current
      setState((draft) => {
        for (let i = draft.length - 1; i >= 0; i--) {
          if (draft[i].done) draft.splice(i, 1)
        }
      })
    })
    
    const [state] = result.current
    expect(state).toHaveLength(2)
    expect(state.every(item => !item.done)).toBe(true)
  })

  it('should preserve immutability', () => {
    const original = { count: 0 }
    const { result } = renderHook(() => useReactive(original))
    
    act(() => {
      const [, setState] = result.current
      setState((draft) => {
        draft.count = 10
      })
    })
    
    const [state] = result.current
    expect(original.count).toBe(0)
    expect(state.count).toBe(10)
  })

  it('should maintain stable setter reference', () => {
    const { result, rerender } = renderHook(() => useReactive(0))
    
    const [, firstSetter] = result.current
    
    rerender()
    
    const [, secondSetter] = result.current
    expect(firstSetter).toBe(secondSetter)
  })

  it('should handle complex nested array and object mutations', () => {
    const { result } = renderHook(() => 
      useReactive({
        users: [
          { id: 1, name: 'Alice', posts: [] },
          { id: 2, name: 'Bob', posts: [] }
        ]
      })
    )
    
    act(() => {
      const [, setState] = result.current
      setState((draft) => {
        const user = draft.users.find(u => u.id === 1)
        user.posts.push({ id: 101, title: 'Hello World' })
        user.name = 'Alice Smith'
      })
    })
    
    const [state] = result.current
    expect(state.users[0].name).toBe('Alice Smith')
    expect(state.users[0].posts).toHaveLength(1)
    expect(state.users[0].posts[0].title).toBe('Hello World')
  })

  it('should handle toggling boolean properties', () => {
    const { result } = renderHook(() => 
      useReactive([
        { id: 1, active: false },
        { id: 2, active: true }
      ])
    )
    
    act(() => {
      const [, setState] = result.current
      setState((draft) => {
        const item = draft.find(item => item.id === 1)
        if (item) item.active = !item.active
      })
    })
    
    const [state] = result.current
    expect(state[0].active).toBe(true)
    expect(state[1].active).toBe(true)
  })

  it('should handle null and undefined values', () => {
    const { result } = renderHook(() => useReactive(null))
    
    act(() => {
      const [, setState] = result.current
      setState({ value: 'test' })
    })
    
    const [state] = result.current
    expect(state).toEqual({ value: 'test' })
  })

  it('should handle empty objects and arrays', () => {
    const { result } = renderHook(() => useReactive({}))
    
    act(() => {
      const [, setState] = result.current
      setState((draft) => {
        draft.newKey = 'newValue'
      })
    })
    
    const [state] = result.current
    expect(state).toEqual({ newKey: 'newValue' })
  })
})
