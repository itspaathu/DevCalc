import { useState } from 'react'

export default function TimestampPage() {
  const [timestamp, setTimestamp] = useState(String(Math.floor(Date.now() / 1000)))
  const [dateStr, setDateStr] = useState(new Date().toISOString().slice(0, 19))

  function timestampToDate(ts: string) {
    setTimestamp(ts)
    const num = Number(ts)
    if (!isNaN(num)) {
      const ms = ts.length > 10 ? num : num * 1000
      const d = new Date(ms)
      if (!isNaN(d.getTime())) setDateStr(d.toISOString().slice(0, 19))
    }
  }

  function dateToTimestamp(value: string) {
    setDateStr(value)
    const d = new Date(value)
    if (!isNaN(d.getTime())) setTimestamp(String(Math.floor(d.getTime() / 1000)))
  }

  const now = new Date(Number(timestamp) * (timestamp.length > 10 ? 1 : 1000))

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Unix Timestamp Converter</h1>
        <p className="text-muted text-sm">Convert between Unix timestamps and human-readable dates.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-4">
          <label className="text-xs uppercase tracking-widest text-muted/70 mb-2 block">
            Unix Timestamp
          </label>
          <input
            value={timestamp}
            onChange={(e) => timestampToDate(e.target.value)}
            className="w-full bg-transparent outline-none font-mono text-xl"
          />
        </div>
        <div className="glass rounded-2xl p-4">
          <label className="text-xs uppercase tracking-widest text-muted/70 mb-2 block">
            Date (ISO, local input)
          </label>
          <input
            type="datetime-local"
            value={dateStr}
            onChange={(e) => dateToTimestamp(e.target.value)}
            className="w-full bg-transparent outline-none font-mono text-sm"
          />
        </div>
      </div>

      <div className="glass rounded-2xl p-4 space-y-2 text-sm font-mono">
        <Row label="UTC" value={!isNaN(now.getTime()) ? now.toUTCString() : '—'} />
        <Row label="ISO 8601" value={!isNaN(now.getTime()) ? now.toISOString() : '—'} />
        <Row
          label="Local"
          value={!isNaN(now.getTime()) ? now.toLocaleString() : '—'}
        />
        <Row
          label="Relative"
          value={!isNaN(now.getTime()) ? relativeTime(now) : '—'}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => timestampToDate(String(Math.floor(Date.now() / 1000)))}
          className="px-3 py-2 rounded-lg bg-white/5 text-sm text-muted hover:text-white transition-colors"
        >
          Use current time
        </button>
        <button
          onClick={() => timestampToDate('0')}
          className="px-3 py-2 rounded-lg bg-white/5 text-sm text-muted hover:text-white transition-colors"
        >
          Unix epoch (0)
        </button>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted">{label}</span>
      <span className="break-all text-right">{value}</span>
    </div>
  )
}

function relativeTime(date: Date): string {
  const diffMs = date.getTime() - Date.now()
  const diffSec = Math.round(diffMs / 1000)
  const abs = Math.abs(diffSec)
  const units: Array<[string, number]> = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ]
  for (const [name, secs] of units) {
    if (abs >= secs || name === 'second') {
      const val = Math.round(diffSec / secs)
      return `${val >= 0 ? 'in ' : ''}${Math.abs(val)} ${name}${Math.abs(val) !== 1 ? 's' : ''}${
        val < 0 ? ' ago' : ''
      }`
    }
  }
  return ''
}
