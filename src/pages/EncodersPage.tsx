import { useMemo, useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { base64Decode, base64Encode, urlDecode, urlEncode } from '../utils/crypto'

type Mode = 'base64' | 'url'

export default function EncodersPage() {
  const [mode, setMode] = useState<Mode>('base64')
  const [input, setInput] = useState('Hello, DevCalc!')
  const [error, setError] = useState<string | null>(null)

  const encoded = useMemo(() => {
    try {
      return mode === 'base64' ? base64Encode(input) : urlEncode(input)
    } catch {
      return ''
    }
  }, [mode, input])

  function swap() {
    try {
      const result = mode === 'base64' ? base64Decode(input) : urlDecode(input)
      setInput(result)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Decode error')
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Encoders</h1>
        <p className="text-muted text-sm">Base64 and URL encoding / decoding.</p>
      </div>

      <div className="flex gap-2">
        {(['base64', 'url'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              mode === m
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'bg-white/5 text-muted hover:text-white'
            }`}
          >
            {m === 'base64' ? 'Base64' : 'URL'}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl p-4">
        <label className="text-xs uppercase tracking-widest text-muted/70 mb-2 block">
          Input (plain text)
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          className="w-full bg-transparent outline-none font-mono text-sm resize-none"
          spellCheck={false}
        />
      </div>

      <div className="flex items-center justify-center">
        <button
          onClick={swap}
          className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-white/5 text-muted hover:text-white transition-colors"
        >
          <ArrowLeftRight size={14} />
          Decode input field
        </button>
      </div>

      <div className="glass rounded-2xl p-4">
        <label className="text-xs uppercase tracking-widest text-muted/70 mb-2 block">
          Encoded
        </label>
        <div className="font-mono text-sm break-all">{encoded}</div>
      </div>

      {error && <div className="text-sm text-red-400">{error}</div>}
    </div>
  )
}
