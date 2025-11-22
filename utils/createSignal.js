import { signal } from '@preact/signals-core'
import { create, isDraft, rawReturn } from 'mutative'

// ------------------------------------
// Immer style signal state producer
// ------------------------------------
export const getSignalValue = ($signal, fnOrValue) => {
  if (typeof fnOrValue === 'function') {
    const mutationResponse = create($signal.value, (draft) => {
      const result = fnOrValue(draft)

      // fnOrValue is a funtion that used the draft
      if (typeof result === 'undefined' || isDraft(result)) {
        return draft
      }
      // fnOrValue is a funtion that returned a value, not used the draft
      return typeof result === 'object' ? rawReturn(result) : result
    })
    // Return response when fnOrValues is a function
    return mutationResponse
  }
  // Return value when fnOrValues is a value
  return fnOrValue
}


// ------------------------------------
// Immer style signal setter
// ------------------------------------
export const setSignal = ($signal, fnOrValue) => {
  $signal.value = getSignalValue($signal, fnOrValue)
  return $signal.value
}

// ------------------------------------
// Better Signal creator
// ------------------------------------
export const createSignal = (initialValue) => {
  const $signal = signal(initialValue)
  $signal.set = (value) => setSignal($signal, value)
  return $signal
}
// ------------------------------------
