import { Signal } from '@preact/signals-core'

/**
 * A React hook that creates a reactive state with Preact Signals under the hood.
 * Similar to useState, but with enhanced features including Immer-style draft mutations.
 * 
 * @template T - The type of the state value
 * @param initialState - The initial value of the state
 * @returns A tuple containing the current state and a setter function
 * 
 * @example
 * ```tsx
 * const [count, setCount] = useReactive(0)
 * setCount(10) // Direct value update
 * 
 * const [todos, setTodos] = useReactive([])
 * setTodos(draft => {
 *   draft.push({ id: 1, text: 'Learn React' })
 * })
 * ```
 */
export function useReactive<T>(
  initialState: T
): [T, (fnOrValue: T | ((draft: T) => T | void)) => T]
