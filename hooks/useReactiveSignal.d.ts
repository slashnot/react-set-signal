import { Signal } from '@preact/signals-core'

/**
 * A React hook that subscribes to an existing Preact Signal and returns its current value.
 * This is useful for sharing state across components using global signals.
 * 
 * @template T - The type of the signal value
 * @param signal - A Preact Signal instance to subscribe to
 * @returns The current value of the signal
 * 
 * @example
 * ```tsx
 * const $counter = createSignal(0)
 * 
 * function DisplayCounter() {
 *   const count = useReactiveSignal($counter)
 *   return <p>Count: {count}</p>
 * }
 * ```
 */
export function useReactiveSignal<T>(signal: Signal<T>): T
