import { Signal } from '@preact/signals-core'

/**
 * Enhanced signal with a set method for Immer-style updates
 */
export interface ReactSetSignal<T> extends Signal<T> {
  /**
   * Update the signal value using direct value or draft mutation function
   * @param fnOrValue - Direct value or function that receives draft for mutation
   */
  set: (fnOrValue: T | ((draft: T) => T | void)) => T
}

/**
 * Create a signal with enhanced setter method
 * @param initialValue - The initial value of the signal
 * @returns A signal with an additional .set() method for Immer-style updates
 */
export function createSignal<T>(initialValue: T): ReactSetSignal<T>

/**
 * Update a signal value using direct value or draft mutation function
 * @param signal - The signal to update
 * @param fnOrValue - Direct value or function that receives draft for mutation
 * @returns The new signal value
 */
export function setSignal<T>(signal: Signal<T>, fnOrValue: T | ((draft: T) => T | void)): T

/**
 * Get the new signal value from a function or direct value
 * @param signal - The signal containing the current value
 * @param fnOrValue - Direct value or function that receives draft for mutation
 * @returns The computed new value
 */
export function getSignalValue<T>(signal: Signal<T>, fnOrValue: T | ((draft: T) => T | void)): T
