// Main exports
export { useReactive } from './hooks/useReactive'
export { useReactiveSignal } from './hooks/useReactiveSignal'
export { createSignal, setSignal, getSignalValue } from './utils/createSignal'

// Re-export from @preact/signals-core
export { signal, effect, computed, batch, untracked } from '@preact/signals-core'
export type { Signal, ReadonlySignal } from '@preact/signals-core'

// Enhanced signal type
export type { ReactSetSignal } from './utils/createSignal'
