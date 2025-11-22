# react-set-signal

A lightweight React library that brings the power of [Preact Signals](https://preactjs.com/guide/v10/signals/) to React applications with enhanced features and an intuitive API. Enjoy fine-grained reactivity with immutable state updates powered by [Mutative](https://github.com/unadlib/mutative).

## Features

- 🎯 **Fine-grained Reactivity** - Leverage Preact Signals for optimal performance
- 🔄 **Immutable Updates** - Built-in Immer-style immutable state mutations using Mutative
- ⚡ **Minimal Re-renders** - Components only re-render when their specific signal values change
- 🪝 **React Hooks Integration** - Seamless integration with React's hooks ecosystem
- 📦 **Tiny Bundle Size** - Minimal overhead, maximum performance

## Installation

```bash
npm install react-set-signal
```

or with pnpm:

```bash
pnpm add react-set-signal
```

## Quick Start

```javascript
import { useReactive } from 'react-set-signal';

function Counter() {
  const [count, setCount] = useReactive(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

## API Reference

### `useReactive(initialState)`

A React hook that creates a reactive state with Preact Signals under the hood. Similar to `useState`, but with enhanced features.

**Parameters:**
- `initialState` - The initial value of the state

**Returns:**
- `[state, setState]` - A tuple containing the current state and a setter function

**Example:**

```javascript
import { useReactive } from 'react-set-signal';

function TodoList() {
  const [todos, setTodos] = useReactive([
    { id: 1, text: 'Learn React', completed: false }
  ]);

  const toggleTodo = (id) => {
    // Immer-style draft mutation
    setTodos((draft) => {
      const todo = draft.find(t => t.id === id);
      if (todo) todo.completed = !todo.completed;
    });
  };

  const addTodo = (text) => {
    // Direct value update
    setTodos((draft) => {
      draft.push({ id: Date.now(), text, completed: false });
    });
  };

  return (
    <div>
      {todos.map(todo => (
        <div key={todo.id} onClick={() => toggleTodo(todo.id)}>
          <input type="checkbox" checked={todo.completed} readOnly />
          {todo.text}
        </div>
      ))}
      <button onClick={() => addTodo('New Todo')}>Add Todo</button>
    </div>
  );
}
```

### `useReactiveSignal($signal)`

A React hook that subscribes to an existing Preact Signal and returns its current value. This is useful for sharing state across components.

**Parameters:**
- `$signal` - A Preact Signal instance

**Returns:**
- `state` - The current value of the signal

**Example:**

```javascript
import { createSignal, useReactiveSignal } from 'react-set-signal';

// Create a global signal
const $counter = createSignal(0);

function DisplayCounter() {
  const count = useReactiveSignal($counter);
  return <p>Count: {count}</p>;
}

function IncrementButton() {
  return (
    <button onClick={() => $counter.set(prev => prev + 1)}>
      Increment
    </button>
  );
}

function App() {
  return (
    <>
      <DisplayCounter />
      <IncrementButton />
    </>
  );
}
```

### `createSignal(initialValue)`

Creates a new Preact Signal with an enhanced API that includes an Immer-style setter method.

**Parameters:**
- `initialValue` - The initial value of the signal

**Returns:**
- `$signal` - A Preact Signal with an additional `.set()` method

**Example:**

```javascript
import { createSignal } from 'react-set-signal';

const $user = createSignal({
  name: 'John',
  age: 30,
  address: { city: 'New York' }
});

// Immer-style mutation
$user.set((draft) => {
  draft.age = 31;
  draft.address.city = 'Los Angeles';
});

// Or direct value update
$user.set({ name: 'Jane', age: 25, address: { city: 'Chicago' } });

// Or function returning new value
$user.set((current) => ({ ...current, age: current.age + 1 }));
```

### Re-exported from Preact Signals

The library also re-exports core Preact Signals functionality:

```javascript
import { signal, effect, computed } from 'react-set-signal';
```

- `signal(initialValue)` - Create a standard Preact Signal
- `effect(fn)` - Create an effect that runs when signals change
- `computed(fn)` - Create a derived signal that automatically updates when its dependencies change

## Advanced Usage

### Shared State Management

Create global signals that can be accessed across your application:

```javascript
// store.js
import { createSignal } from 'react-set-signal';

export const $theme = createSignal('light');
export const $user = createSignal(null);
export const $settings = createSignal({
  notifications: true,
  sound: false
});
```

```javascript
// ThemeToggle.jsx
import { useReactiveSignal } from 'react-set-signal';
import { $theme } from './store';

function ThemeToggle() {
  const theme = useReactiveSignal($theme);
  
  return (
    <button onClick={() => $theme.set(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}
```

### Complex State Updates

The setter function supports Immer-style draft mutations, making complex nested updates simple:

```javascript
const [state, setState] = useReactive({
  users: [
    { id: 1, name: 'Alice', posts: [] },
    { id: 2, name: 'Bob', posts: [] }
  ],
  selectedUserId: null
});

// Complex nested update
setState((draft) => {
  const user = draft.users.find(u => u.id === 1);
  user.posts.push({ id: Date.now(), title: 'New Post' });
  draft.selectedUserId = 1;
});
```

### Effects and Computed Values

Use Preact's `effect` for side effects:

**Example with effect:**
```javascript
import { createSignal, effect } from 'react-set-signal';

const $count = createSignal(0);

// Run side effect when signal changes
effect(() => {
  console.log('Count changed:', $count.value);
  document.title = `Count: ${$count.value}`;
});
```

Use Preact's `computed` for computed values:

**Example with computed:**

```javascript
import { createSignal, computed, useReactiveSignal } from 'react-set-signal';

const $firstName = createSignal('John');
const $lastName = createSignal('Doe');

// Computed signal: automatically updates when firstName or lastName changes
const $fullName = computed(() => `${$firstName.value} ${$lastName.value}`);

function Profile() {
  const fullName = useReactiveSignal($fullName);
  return <h1>{fullName}</h1>;
}

// Update signals
$firstName.set('Jane');
// $fullName automatically recomputes to "Jane Doe"
```

## How It Works

`react-set-signal` uses React's `useSyncExternalStore` hook to subscribe to Preact Signals, ensuring compatibility with React 18+ concurrent features. State updates are handled through [Mutative](https://github.com/unadlib/mutative), providing Immer-style immutable updates with better performance.

## Performance Benefits

- **Minimal Re-renders**: Only components that read a specific signal value will re-render when it changes
- **Efficient Updates**: Mutative provides fast immutable updates without the overhead of structural sharing
- **Fine-grained Reactivity**: Signals allow for precise dependency tracking

## Browser Support

Works in all modern browsers that support React 18+.

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Related Projects

- [Preact Signals](https://github.com/preactjs/signals) - The underlying signal implementation
- [Mutative](https://github.com/unadlib/mutative) - Fast immutable updates
- [React](https://react.dev) - The UI library this package is built for
