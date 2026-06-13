import { useState } from 'react'
import { formatJson, minifyJson } from '../utils/crypto'

const SAMPLE = `{"name":"DevCalc","version":1,"features":["calculator","converters","bitwise"],"active":true}`

export default function JsonPage() {
  const [input, setInput] = useState(SAMPLE)
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  function beautify() {
    try {
      setOutput(formatJson(input, 2))
      setError(null)
    } catch (e) {
      setError('Invalid JSON: ' + (e instanceof Error ? e.message : 'parse error'))
    }
  }

  function minify() {
    try {
      setOutput(minifyJson(input))
      setError(null)
    } catch (e) {
      setError('Invalid JSON: ' + (e instanceof Error ? e.message : 'parse error'))
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold mb-1">JSON Formatter</h1>
        <p className="text-muted text-sm">Paste JSON and beautify or minify instantly.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-4">
          <label className="text-xs uppercase tracking-widest text-muted/70 mb-2 block">
            Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={14}
            className="w-full bg-transparent outline-none font-mono text-sm resize-none"
            spellCheck={false}
          />
        </div>
        <div className="glass rounded-2xl p-4">
          <label className="text-xs uppercase tracking-widest text-muted/70 mb-2 block">
            Output
          </label>
          <pre className="font-mono text-sm whitespace-pre-wrap break-all overflow-y-auto max-h-[320px] scrollbar-thin">
            {output || '—'}
          </pre>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={beautify}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white text-sm"
        >
          Beautify
        </button>
        <button onClick={minify} className="px-4 py-2 rounded-lg bg-white/5 text-sm hover:text-white text-muted">
          Minify
        </button>
      </div>

      {error && <div className="text-sm text-red-400">{error}</div>}
    </div>
  )
}
