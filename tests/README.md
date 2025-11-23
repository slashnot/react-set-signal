# Test Coverage Summary

## Overview
Comprehensive unit tests for `react-set-signal` using Vitest and React Testing Library.

## Test Files

### 1. `tests/createSignal.test.js`
Tests for the `createSignal` utility and related functions.

**Coverage:**
- ✅ Signal creation with different data types (primitives, objects, arrays)
- ✅ `setSignal` function with direct values
- ✅ Draft-based mutations for objects and arrays
- ✅ Array operations (push, splice, filter-like operations)
- ✅ Nested object and array updates
- ✅ Immutability preservation
- ✅ `getSignalValue` function behavior
- ✅ `.set()` method chaining
- ✅ Edge cases (null, undefined, empty objects/arrays, booleans, strings)

**Total: 26 tests**

### 2. `tests/useReactive.test.js`
Tests for the `useReactive` hook.

**Coverage:**
- ✅ Initialization with different data types
- ✅ State updates with direct values
- ✅ Object mutations using draft pattern
- ✅ Array mutations using draft pattern
- ✅ Nested object and array updates
- ✅ Multiple sequential updates
- ✅ Array splice operations
- ✅ Filter-like operations with splice
- ✅ Immutability preservation
- ✅ Stable setter reference across re-renders
- ✅ Complex nested mutations
- ✅ Boolean property toggling
- ✅ Null and undefined handling
- ✅ Empty objects and arrays

**Total: 17 tests**

### 3. `tests/useReactiveSignal.test.js`
Tests for the `useReactiveSignal` hook.

**Coverage:**
- ✅ Signal subscription and value reading
- ✅ Reactivity to signal changes
- ✅ Object and array signal updates
- ✅ Multiple sequential updates
- ✅ Nested object updates
- ✅ Multiple components subscribing to same signal
- ✅ Global signals created outside components
- ✅ Different data types (boolean, string, null, undefined)
- ✅ Complex nested updates
- ✅ Array operations
- ✅ Reactivity across unmount/remount
- ✅ Multiple signal instances
- ✅ Rapid successive updates

**Total: 16 tests**

## Running Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage
```

## Test Environment

- **Test Runner:** Vitest 4.0.13
- **Testing Library:** @testing-library/react 16.3.0
- **Environment:** jsdom 27.2.0
- **Setup:** @testing-library/jest-dom for additional matchers

## Notes

### Primitive Values
The library's `getSignalValue` function is optimized for object/array mutations using the draft pattern. For primitive values, direct value updates work best:

```javascript
// ✅ Recommended for primitives
$signal.set(10)

// ✅ Recommended for objects
$signal.set((draft) => {
  draft.count = 10
})
```

### Immutability
All tests verify that the original data is never mutated, ensuring proper immutability through the Mutative library.

### Array Operations
Tests cover the correct pattern for removing items from arrays:
```javascript
// ✅ Correct: Use splice in reverse to avoid index shifting
setState((draft) => {
  for (let i = draft.length - 1; i >= 0; i--) {
    if (condition) draft.splice(i, 1)
  }
})
```

## Total Test Count
**59 passing tests** across 3 test suites
