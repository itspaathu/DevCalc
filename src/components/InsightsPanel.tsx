import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/appStore'
import { convertAll, toBinaryPadded } from '../utils/numberSystems'

export default function InsightsPanel() {
  const { lastResult, expression, history } = useAppStore()

  const bases = useMemo(() => {
    if (lastResult === null) return null
    if (!Number.isFinite(lastResult)) return null
    if (Math.abs(lastResult % 1) > 1e-9) return null // non-integers: skip base conversion
    try {
      return convertAll(BigInt(Math.trunc(lastResult)))
    } catch {
      return null
    }
  }, [lastResult])

  const bits = useMemo(() => {
    if (lastResult === null || Math.abs(lastResult % 1) > 1e-9) return null
    const v = BigInt(Math.trunc(lastResult))
    if (v < 0n || v > 4294967295n) return toBinaryPadded(v, 8)
    let width = 8
    while (BigInt(2) ** BigInt(width) <= v && width < 32) width *= 2
    return toBinaryPadded(v, width)
  }, [lastResult])

  return (
    <aside className="glass hidden lg:flex flex-col w-[300px] h-full rounded-2xl m-2 ml-0 overflow-hidden">
      <div className="px-4 py-4 border-b border-white/5">
        <h3 className="text-sm font-semibold">Insights</h3>
        <p className="text-xs text-muted mt-0.5">Live breakdown of your calculation</p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {lastResult === null ? (
          <div className="text-sm text-muted">
            Start typing an expression to see live conversions, bit breakdowns, and history
            context.
          </div>
        ) : (
          <>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted/70 mb-2">
                Expression
              </div>
              <div className="font-mono text-sm text-muted break-all">{expression || '—'}</div>
            </div>

            {bases ? (
              <div className="space-y-2">
                <div className="text-[10px] uppercase tracking-widest text-muted/70 mb-1">
                  Number Systems
                </div>
                {(['bin', 'oct', 'dec', 'hex'] as const).map((b) => (
                  <motion.div
                    key={b}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2"
                  >
                    <span className="text-xs uppercase text-muted">{b}</span>
                    <span className="font-mono text-sm break-all text-right">{bases[b]}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted">
                Number system breakdown is available for integer results.
              </div>
            )}

            {bits && (
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted/70 mb-2">
                  Bit Representation
                </div>
                <div className="font-mono text-xs leading-relaxed break-all bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2">
                  {bits.split('').map((bit, idx) => (
                    <span
                      key={idx}
                      className={bit === '1' ? 'text-primary' : 'text-muted/60'}
                    >
                      {bit}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted/70 mb-2">
                Recent History
              </div>
              <div className="space-y-1.5">
                {history.slice(0, 4).map((h) => (
                  <div
                    key={h.id}
                    className="text-xs flex items-center justify-between gap-2 bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2"
                  >
                    <span className="font-mono text-muted truncate">{h.expression}</span>
                    <span className="font-mono text-white shrink-0">{h.result}</span>
                  </div>
                ))}
                {history.length === 0 && (
                  <div className="text-xs text-muted">No history yet.</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
