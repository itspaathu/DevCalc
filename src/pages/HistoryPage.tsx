import { useMemo, useState } from 'react'
import { Star, Trash2, RotateCcw, Search } from 'lucide-react'
import { useAppStore } from '../store/appStore'

function groupLabel(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfYesterday = new Date(startOfToday)
  startOfYesterday.setDate(startOfYesterday.getDate() - 1)
  const startOfWeek = new Date(startOfToday)
  startOfWeek.setDate(startOfWeek.getDate() - 7)

  if (date >= startOfToday) return 'Today'
  if (date >= startOfYesterday) return 'Yesterday'
  if (date >= startOfWeek) return 'Last Week'
  return 'Older'
}

export default function HistoryPage() {
  const { history, toggleFavorite, deleteHistoryEntry, clearHistory, setExpression, setActiveView } =
    useAppStore()
  const [search, setSearch] = useState('')
  const [favoritesOnly, setFavoritesOnly] = useState(false)

  const filtered = useMemo(() => {
    return history.filter((h) => {
      if (favoritesOnly && !h.favorite) return false
      if (search && !h.expression.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [history, search, favoritesOnly])

  const groups = useMemo(() => {
    const map = new Map<string, typeof history>()
    for (const entry of filtered) {
      const label = groupLabel(entry.timestamp)
      if (!map.has(label)) map.set(label, [])
      map.get(label)!.push(entry)
    }
    return map
  }, [filtered])

  function rerun(expr: string) {
    setExpression(expr)
    setActiveView('calculator')
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">History</h1>
          <p className="text-muted text-sm">Search, favorite, and re-run past calculations.</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-muted hover:text-red-400 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="glass rounded-2xl p-3 flex items-center gap-3">
        <Search size={16} className="text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search history..."
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted/50"
        />
        <button
          onClick={() => setFavoritesOnly((f) => !f)}
          className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
            favoritesOnly ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted'
          }`}
        >
          Favorites
        </button>
      </div>

      {groups.size === 0 && (
        <div className="text-sm text-muted text-center py-8">No history entries yet.</div>
      )}

      {Array.from(groups.entries()).map(([label, entries]) => (
        <div key={label}>
          <div className="text-[10px] uppercase tracking-widest text-muted/70 mb-2">{label}</div>
          <div className="space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="glass glass-hover rounded-xl px-4 py-3 flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm text-muted truncate">{entry.expression}</div>
                  <div className="font-mono text-base">{entry.result}</div>
                </div>
                <button
                  onClick={() => toggleFavorite(entry.id)}
                  className={entry.favorite ? 'text-primary' : 'text-muted hover:text-white'}
                >
                  <Star size={16} fill={entry.favorite ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => rerun(entry.expression)}
                  className="text-muted hover:text-white transition-colors"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => deleteHistoryEntry(entry.id)}
                  className="text-muted hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
