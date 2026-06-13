import { useEffect, useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { md5, sha1, sha256 } from '../utils/crypto'

export default function HashPage() {
  const [input, setInput] = useState('Hello, DevCalc!')
  const [hashes, setHashes] = useState({ md5: '', sha1: '', sha256: '' })
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function compute() {
      const md5Hash = md5(input)
      const sha1Hash = await sha1(input)
      const sha256Hash = await sha256(input)
      if (active) setHashes({ md5: md5Hash, sha1: sha1Hash, sha256: sha256Hash })
    }
    compute()
    return () => {
      active = false
    }
  }, [input])

  function copy(key: string, value: string) {
    navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 1200)
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Hash Generator</h1>
        <p className="text-muted text-sm">Generate MD5, SHA-1, and SHA-256 digests instantly.</p>
      </div>

      <div className="glass rounded-2xl p-4">
        <label className="text-xs uppercase tracking-widest text-muted/70 mb-2 block">
          Input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="w-full bg-transparent outline-none font-mono text-sm resize-none"
          spellCheck={false}
        />
      </div>

      <div className="space-y-3">
        {(['md5', 'sha1', 'sha256'] as const).map((key) => (
          <div key={key} className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest text-muted/70">
                {key === 'md5' ? 'MD5' : key === 'sha1' ? 'SHA-1' : 'SHA-256'}
              </span>
              <button
                onClick={() => copy(key, hashes[key])}
                className="text-muted hover:text-white transition-colors"
              >
                {copied === key ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
              </button>
            </div>
            <div className="font-mono text-sm break-all text-white">{hashes[key]}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
