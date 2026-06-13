import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { toBinaryPadded } from '../utils/numberSystems'

type Op = 'AND' | 'OR' | 'XOR' | 'NOT' | 'LSHIFT' | 'RSHIFT'

const OPS: Array<{ key: Op; label: string; symbol: string }> = [
  { key: 'AND', label: 'AND', symbol: '&' },
  { key: 'OR', label: 'OR', symbol: '|' },
  { key: 'XOR', label: 'XOR', symbol: '^' },
  { key: 'NOT', label: 'NOT', symbol: '~' },
  { key: 'LSHIFT', label: 'Left Shift', symbol: '<<' },
  { key: 'RSHIFT', label: 'Right Shift', symbol: '>>' },
]

export default function BitwisePage() {
  const [a, setA] = useState(15)
  const [b, setB] = useState(7)
  const [op, setOp] = useState<Op>('AND')
  const bits = 8

  const result = useMemo(() => {
    const mask = (1 << bits) - 1
    switch (op) {
      case 'AND':
        return (a & b) & mask
      case 'OR':
        return (a | b) & mask
      case 'XOR':
        return (a ^ b) & mask
      case 'NOT':
        return (~a) & mask
      case 'LSHIFT':
        return (a << b) & mask
      case 'RSHIFT':
        return (a >> b) & mask
    }
  }, [a, b, op])

  const binA = toBinaryPadded(BigInt(a), bits)
  const binB = toBinaryPadded(BigInt(b), bits)
  const binResult = toBinaryPadded(BigInt(result), bits)

  const isUnary = op === 'NOT'

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Bitwise Playground</h1>
        <p className="text-muted text-sm">
          Visualize AND, OR, XOR, NOT, and bit shifts with live highlighting.
        </p>
      </div>

      <div className="glass rounded-2xl p-4 flex flex-wrap gap-2">
        {OPS.map((o) => (
          <button
            key={o.key}
            onClick={() => setOp(o.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-mono transition-colors ${
              op === o.key
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'bg-white/5 text-muted hover:text-white'
            }`}
          >
            {o.label} <span className="opacity-60">{o.symbol}</span>
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-4">
          <label className="text-xs uppercase tracking-widest text-muted/70 mb-2 block">
            A
          </label>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(Number(e.target.value) || 0)}
            className="w-full bg-transparent outline-none font-mono text-xl"
          />
        </div>
        <div className="glass rounded-2xl p-4">
          <label className="text-xs uppercase tracking-widest text-muted/70 mb-2 block">
            {isUnary ? 'B (unused)' : op === 'LSHIFT' || op === 'RSHIFT' ? 'Shift amount' : 'B'}
          </label>
          <input
            type="number"
            value={b}
            disabled={isUnary}
            onChange={(e) => setB(Number(e.target.value) || 0)}
            className="w-full bg-transparent outline-none font-mono text-xl disabled:opacity-30"
          />
        </div>
      </div>

      <div className="glass rounded-2xl p-6 font-mono">
        <BitRow label={`A (${a})`} bits={binA} highlight={result} />
        {!isUnary && <BitRow label={`B (${b})`} bits={binB} highlight={result} />}
        <div className="border-t border-white/10 my-3" />
        <BitRow label={`Result (${result})`} bits={binResult} highlight={result} accent />
      </div>

      <div className="glass rounded-2xl p-4 text-sm text-muted">
        <span className="text-white font-medium">Tip:</span> highlighted bits show where the
        result has a <span className="text-primary font-mono">1</span>. Operations are performed
        on {bits}-bit unsigned values for clarity.
      </div>
    </div>
  )
}

function BitRow({
  label,
  bits,
  highlight,
  accent,
}: {
  label: string
  bits: string
  highlight: number
  accent?: boolean
}) {
  const resultBits = highlight.toString(2).padStart(bits.length, '0')
  return (
    <div className="flex items-center gap-4 py-1.5">
      <span className="w-32 shrink-0 text-muted text-sm">{label}</span>
      <div className="flex gap-1">
        {bits.split('').map((bit, idx) => {
          const isOne = bit === '1'
          const resultOne = resultBits[idx] === '1'
          return (
            <motion.span
              key={idx}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.02 }}
              className={`w-7 h-9 flex items-center justify-center rounded-md text-sm font-semibold border ${
                accent && isOne
                  ? 'bg-gradient-to-br from-primary to-secondary border-transparent text-white'
                  : !accent && resultOne && isOne
                  ? 'bg-primary/20 border-primary/40 text-primary'
                  : 'bg-white/[0.03] border-white/5 text-muted'
              }`}
            >
              {bit}
            </motion.span>
          )
        })}
      </div>
    </div>
  )
}
