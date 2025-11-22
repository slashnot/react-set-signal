import { useReactive, useReactiveSignal, createSignal, effect } from 'react-set-signal'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// ----------------------------------------------------
// Global signals created with createSignal
// ----------------------------------------------------
const $theme = createSignal('light')
const $profile = createSignal({
  name: 'Ada Lovelace',
  stats: { clicks: 0 },
  preferences: { accent: '#6366f1' }
})

// Apply dark mode via Tailwind's 'dark' class and log reactive changes
effect(() => {
  const root = document.documentElement
  if ($theme.value === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
  console.log('[signal]', { theme: $theme.value, clicks: $profile.value.stats.clicks })
})

// ----------------------------------------------------
// Theme components using useReactiveSignal
// ----------------------------------------------------
const ThemeToggle = () => {
  const theme = useReactiveSignal($theme)
  return (
    <button
      onClick={() => $theme.set(t => t === 'light' ? 'dark' : 'light')}
      className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 active:bg-indigo-700 transition"
    >
      <span className={`h-3 w-3 rounded-full shadow ${theme === 'dark' ? 'bg-yellow-400' : 'bg-white/80'}`}></span>
      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    </button>
  )
}

// ----------------------------------------------------
// Profile panel using draft mutation & direct function return
// ----------------------------------------------------
const ProfilePanel = () => {
  const profile = useReactiveSignal($profile)
  const increment = () => $profile.set(d => { d.stats.clicks += 1 })
  const randomizeAccent = () => $profile.set(d => {
    d.preferences.accent = `#${Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0')}`
  })
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-200">Profile</h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">Signal bound</span>
      </div>
      <div className="space-y-1 text-sm">
        <p><span className="font-medium">Name:</span> {profile.name}</p>
        <p><span className="font-medium">Clicks:</span> {profile.stats.clicks}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button onClick={increment} className="px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-700 dark:hover:bg-slate-600 transition">Add Click</button>
        <button onClick={randomizeAccent} className="px-3 py-1.5 text-xs font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition">Random Accent</button>
      </div>
      <div className="h-5 w-full rounded-md ring-1 ring-slate-200 dark:ring-slate-700" style={{ background: profile.preferences.accent }} />
    </div>
  )
}

// ----------------------------------------------------
// Todo app demonstrating useReactive with nested updates
// ----------------------------------------------------
const TodoApp = () => {
  const [todos, setTodos] = useReactive([
    { id: 1, text: 'Explore signals', done: false },
    { id: 2, text: 'Write reactive component', done: true }
  ])
  const addTodo = () => {
    const text = prompt('New todo:') || 'Untitled'
    setTodos(draft => { draft.push({ id: Date.now(), text, done: false }) })
  }
  const toggleTodo = id => setTodos(d => { const t = d.find(t => t.id === id); if (t) t.done = !t.done })
  const removeTodo = id => setTodos(d => { const i = d.findIndex(t => t.id === id); if (i !== -1) d.splice(i,1) })
  // IMPORTANT: Do not return a filtered array built from the draft.
  // Returning an array produced via draft.filter() captures revoked proxies.
  // Instead mutate the draft in-place so Mutative can finalize safely.
  const clearCompleted = () => setTodos(draft => {
    for (let i = draft.length - 1; i >= 0; i--) {
      if (draft[i].done) draft.splice(i, 1)
    }
  })
  const completed = todos.filter(t => t.done).length
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-200">Todos</h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">Local reactive</span>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400">{completed} / {todos.length} completed</p>
      <div className="flex flex-wrap gap-3">
        <button onClick={addTodo} className="px-3 py-1.5 text-xs font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition">Add</button>
        <button onClick={clearCompleted} disabled={!completed} className="px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 dark:bg-slate-700 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 dark:hover:bg-slate-600 transition">Clear Completed</button>
      </div>
      <ul className="space-y-2">
        {todos.map(t => (
          <li key={t.id} className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition ${t.done ? 'opacity-70 line-through' : ''}`}>
            <span onClick={() => toggleTodo(t.id)} className="flex-1 cursor-pointer select-none">{t.text}</span>
            <button onClick={() => toggleTodo(t.id)} className={`text-xs rounded px-2 py-1 font-medium border border-slate-300 dark:border-slate-600 ${t.done ? 'bg-green-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}>{t.done ? 'Done' : 'Mark'}</button>
            <button onClick={() => removeTodo(t.id)} className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition text-xs" title="Remove">✕</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ----------------------------------------------------
// App assembling everything
// ----------------------------------------------------
function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 py-8 grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-wide">Global Signals</h2>
            <ThemeToggle />
          </div>
          <ProfilePanel />
        </div>
        <div className="space-y-4">
          <h2 className="text-base font-semibold tracking-wide">Local Reactive State</h2>
          <TodoApp />
        </div>
      </main>
      <Footer />
    </div>
  )
}

// Simple header demonstrating reading multiple signals
const Header = () => {
  const theme = useReactiveSignal($theme)
  const profile = useReactiveSignal($profile)
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/85 dark:bg-slate-900/85 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <img src={reactLogo} alt="React" className="w-10 h-10" />
          <img src={viteLogo} alt="Vite" className="w-10 h-10" />
        </div>
        <div className="flex-1" />
        <div className="flex flex-col items-end text-xs font-mono">
          <span className="text-slate-600 dark:text-slate-400">theme={theme}</span>
          <span className="text-slate-600 dark:text-slate-400">user={profile.name}</span>
          <span className="text-slate-600 dark:text-slate-400">clicks={profile.stats.clicks}</span>
        </div>
      </div>
    </header>
  )
}

const Footer = () => (
  <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
    <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
      <span>react-set-signal demo</span>
      <span className="font-mono">useReactive · useReactiveSignal · createSignal</span>
    </div>
  </footer>
)

// StyleInjector removed; Tailwind utility classes now drive presentation.

export default App
