import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Base } from '../utils/numberSystems'
import { isValidInBase, parseFromBase, formatToBase } from '../utils/numberSystems'

const BASES: Array<{ key: Base; label: string; prefix: string }> = [
  { key: 'dec', label: 'Decimal', prefix: '' },
  { key: 'bin', label: 'Binary', prefix: '0b' },
  { key: 'hex', label: 'Hexadecimal', prefix: '0x' },
  { key: 'oct', label: 'Octal', prefix: '0o' },
]

export default function ConvertersPage() {
  const [values, setValues] = useState<Record<Base, string>>({
    dec: '255',
    bin: '11111111',
    hex: 'FF',
    oct: '377',
  })
  const [errorBase, setErrorBase] = useState<Base | null>(null)

  function handleChange(base: Base, raw: string) {
    if (!isValidInBase(raw, base)) {
      setErrorBase(base)
      setValues((v) => ({ ...v, [base]: raw }))
      return
    }
    setErrorBase(null)
    const parsed = parseFromBase(raw, base)
    if (parsed === null) {
      setValues((v) => ({ ...v, [base]: raw }))
      return
    }
    const next: Record<Base, string> = { ...values, [base]: raw }
    for (const b of BASES) {
      if (b.key !== base) next[b.key] = formatToBase(parsed, b.key)
    }
    setValues(next)
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Number System Explorer</h1>
        <p className="text-muted text-sm">
          Edit any representation — every other base updates live.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {BASES.map((b) => (
          <motion.div
            key={b.key}
            layout
            className={`glass rounded-2xl p-4 ${
              errorBase === b.key ? 'border-red-400/50' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest text-muted/70">{b.label}</span>
              {b.prefix && (
                <span className="text-[10px] font-mono text-muted/50">{b.prefix}</span>
              )}
            </div>
            <input
              value={values[b.key]}
              onChange={(e) => handleChange(b.key, e.target.value)}
              className="w-full bg-transparent outline-none font-mono text-xl break-all"
              spellCheck={false}
            />
          </motion.div>
        ))}
      </div>

      {errorBase && (
        <div className="text-sm text-red-400">
          Invalid {BASES.find((b) => b.key === errorBase)?.label.toLowerCase()} value.
        </div>
      )}

      <div className="glass rounded-2xl p-4">
        <div className="text-xs uppercase tracking-widest text-muted/70 mb-3">
          Quick reference
        </div>
        <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted font-mono">
          <div>0xFF = 255 = 0b11111111</div>
          <div>0o10 = 8 = 0b1000</div>
          <div>0x10 = 16 = 0b10000</div>
          <div>0xFFFF = 65535</div>
        </div>
      </div>
    </div>
  )
}
