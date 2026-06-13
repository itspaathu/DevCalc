import { useState } from 'react'
import { Plus, Trash2, Play } from 'lucide-react'
import { useAppStore } from '../store/appStore'

export default function SnippetsPage() {
  const { snippets, addSnippet, deleteSnippet, setExpression, setActiveView } = useAppStore()
  const [name, setName] = useState('')
  const [expression, setExpr] = useState('')

  function save() {
    if (!name.trim() || !expression.trim()) return
    addSnippet(name.trim(), expression.trim())
    setName('')
    setExpr('')
  }

  function run(expr: string) {
    setExpression(expr)
    setActiveView('calculator')
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Saved Snippets</h1>
        <p className="text-muted text-sm">Save reusable calculations and formulas.</p>
      </div>

      <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name (e.g. salary_tax)"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted/50 border-b sm:border-b-0 sm:border-r border-white/5 sm:pr-3 pb-2 sm:pb-0"
        />
        <input
          value={expression}
          onChange={(e) => setExpr(e.target.value)}
          placeholder="Expression (e.g. 50000 * 0.3)"
          className="flex-1 bg-transparent outline-none font-mono text-sm placeholder:text-muted/50"
        />
        <button
          onClick={save}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white text-sm shrink-0"
        >
          <Plus size={14} />
          Save
        </button>
      </div>

      {snippets.length === 0 ? (
        <div className="text-sm text-muted text-center py-8">No snippets saved yet.</div>
      ) : (
        <div className="space-y-2">
          {snippets.map((s) => (
            <div key={s.id} className="glass glass-hover rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{s.name}</div>
                <div className="font-mono text-xs text-muted truncate">{s.expression}</div>
              </div>
              <button onClick={() => run(s.expression)} className="text-muted hover:text-white transition-colors">
                <Play size={16} />
              </button>
              <button onClick={() => deleteSnippet(s.id)} className="text-muted hover:text-red-400 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
