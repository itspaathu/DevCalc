import { useMemo, useState } from 'react'

const PRESETS: Record<string, { pattern: string; flags: string }> = {
  'Email': { pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'g' },
  'URL': { pattern: 'https?:\\/\\/[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:\\/?#[\\]@!\\$&\\\'\\(\\)\\*\\+,;=.]*', flags: 'g' },
  'IPv4': { pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: 'g' },
  'Hex Color': { pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b', flags: 'g' },
}

export default function RegexPage() {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')
  const [flags, setFlags] = useState('g')
  const [text, setText] = useState(
    'Contact us at hello@devcalc.app or support@example.com for help.'
  )

  const { matches, error } = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags)
      const found = [...text.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))]
      return { matches: found.map((m) => m[0]), error: null }
    } catch (e) {
      return { matches: [], error: e instanceof Error ? e.message : 'Invalid regex' }
    }
  }, [pattern, flags, text])

  const highlighted = useMemo(() => {
    if (error) return text
    try {
      const re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g')
      const parts: Array<{ text: string; match: boolean }> = []
      let lastIndex = 0
      for (const m of text.matchAll(re)) {
        if (m.index === undefined) continue
        if (m.index > lastIndex) parts.push({ text: text.slice(lastIndex, m.index), match: false })
        parts.push({ text: m[0], match: true })
        lastIndex = m.index + m[0].length
      }
      if (lastIndex < text.length) parts.push({ text: text.slice(lastIndex), match: false })
      return parts
    } catch {
      return text
    }
  }, [pattern, flags, text, error])

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Regex Tester</h1>
        <p className="text-muted text-sm">Test patterns against sample text with live matches.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(PRESETS).map(([name, preset]) => (
          <button
            key={name}
            onClick={() => {
              setPattern(preset.pattern)
              setFlags(preset.flags)
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-mono bg-white/5 text-muted hover:text-white transition-colors"
          >
            {name}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="text-xs uppercase tracking-widest text-muted/70 mb-2 block">
            Pattern
          </label>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full bg-transparent outline-none font-mono text-sm"
            spellCheck={false}
          />
        </div>
        <div className="sm:w-28">
          <label className="text-xs uppercase tracking-widest text-muted/70 mb-2 block">
            Flags
          </label>
          <input
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            className="w-full bg-transparent outline-none font-mono text-sm"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <label className="text-xs uppercase tracking-widest text-muted/70 mb-2 block">
          Test string
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full bg-transparent outline-none font-mono text-sm resize-none"
          spellCheck={false}
        />
      </div>

      {error ? (
        <div className="text-sm text-red-400">{error}</div>
      ) : (
        <div className="glass rounded-2xl p-4">
          <div className="text-xs uppercase tracking-widest text-muted/70 mb-2">
            Highlighted ({matches.length} match{matches.length === 1 ? '' : 'es'})
          </div>
          <div className="font-mono text-sm whitespace-pre-wrap break-all leading-relaxed">
            {Array.isArray(highlighted)
              ? highlighted.map((part, idx) =>
                  part.match ? (
                    <span key={idx} className="bg-primary/30 text-primary rounded px-0.5">
                      {part.text}
                    </span>
                  ) : (
                    <span key={idx}>{part.text}</span>
                  )
                )
              : highlighted}
          </div>
        </div>
      )}
    </div>
  )
}
