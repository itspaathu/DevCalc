import { useAppStore } from '../store/appStore'

export default function SettingsPage() {
  const { clearHistory, snippets, history } = useAppStore()

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Settings</h1>
        <p className="text-muted text-sm">App preferences and data management.</p>
      </div>

      <div className="glass rounded-2xl p-4 space-y-3">
        <div className="text-xs uppercase tracking-widest text-muted/70">About</div>
        <p className="text-sm text-muted">
          DevCalc is a developer-focused calculator combining arithmetic, number system
          exploration, bitwise operations, and everyday dev utilities — all in one fast,
          keyboard-first interface.
        </p>
      </div>

      <div className="glass rounded-2xl p-4 space-y-3">
        <div className="text-xs uppercase tracking-widest text-muted/70">Storage</div>
        <div className="text-sm text-muted">
          {history.length} history entries · {snippets.length} saved snippets
        </div>
        <button
          onClick={clearHistory}
          className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-muted hover:text-red-400 transition-colors"
        >
          Clear history
        </button>
        <p className="text-xs text-muted/70">
          All data is stored locally in your browser via localStorage. Nothing is sent to a
          server.
        </p>
      </div>

      <div className="glass rounded-2xl p-4 space-y-2">
        <div className="text-xs uppercase tracking-widest text-muted/70">Keyboard shortcuts</div>
        <div className="text-sm text-muted space-y-1 font-mono">
          <div>Ctrl / ⌘ + K — Command palette</div>
          <div>Enter — Save calculation to history</div>
          <div>Esc — Clear input / close dialogs</div>
        </div>
      </div>
    </div>
  )
}
