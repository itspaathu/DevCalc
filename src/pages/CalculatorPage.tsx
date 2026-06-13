import { useState } from 'react'
import { motion } from 'framer-motion'
import { Delete, CornerDownLeft, Sparkles } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { evaluateExpression, formatNumber } from '../utils/evaluator'
import { tryParseNaturalLanguage } from '../utils/nlp'
import AnimatedNumber from '../components/AnimatedNumber'

const BUTTONS: Array<{ label: string; value: string; variant?: 'op' | 'accent' | 'default' }> = [
  { label: 'C', value: 'clear', variant: 'accent' },
  { label: '(', value: '(' },
  { label: ')', value: ')' },
  { label: '÷', value: '/', variant: 'op' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '×', value: '*', variant: 'op' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '−', value: '-', variant: 'op' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '+', value: '+', variant: 'op' },
  { label: '0', value: '0' },
  { label: '.', value: '.' },
  { label: '%', value: '%', variant: 'op' },
  { label: '^', value: '^', variant: 'op' },
]

export default function CalculatorPage() {
  const { expression, setExpression, lastResult, setLastResult, addHistory } = useAppStore()
  const [error, setError] = useState<string | null>(null)
  const [resultDecimal, setResultDecimal] = useState(0)
  const [nlLabel, setNlLabel] = useState<string | null>(null)

  function evaluate(expr: string) {
    if (!expr.trim()) {
      setLastResult(null)
      setError(null)
      return
    }
    try {
      let toEval = expr
      const nl = tryParseNaturalLanguage(expr)
      if (nl) {
        toEval = nl.expression
        setNlLabel(nl.label ?? null)
      } else {
        setNlLabel(null)
      }
      const result = evaluateExpression(toEval)
      setLastResult(result)
      setResultDecimal(Math.abs(result % 1))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid expression')
      setLastResult(null)
    }
  }

  function handleInput(val: string) {
    if (val === 'clear') {
      setExpression('')
      setLastResult(null)
      setError(null)
      setNlLabel(null)
      return
    }
    const next = expression + val
    setExpression(next)
    evaluate(next)
  }

  function handleBackspace() {
    const next = expression.slice(0, -1)
    setExpression(next)
    evaluate(next)
  }

  function handleSubmit() {
    if (error || lastResult === null) return
    addHistory({ expression, result: formatNumber(lastResult) })
  }

  function handleChange(value: string) {
    setExpression(value)
    evaluate(value)
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Calculator</h1>
        <p className="text-muted text-sm">
          Standard arithmetic, natural language, and live insights.
        </p>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 text-muted text-sm mb-2 font-mono">
          <span className="text-primary">{'>'}</span>
          <input
            autoFocus
            value={expression}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit()
              if (e.key === 'Escape') handleInput('clear')
            }}
            placeholder="25 * 12 or What is 15% of 2000?"
            className="flex-1 bg-transparent outline-none text-white placeholder:text-muted/50 text-lg"
          />
        </div>

        <div className="min-h-[64px] flex items-center">
          {error ? (
            <span className="text-red-400 text-sm font-mono">{error}</span>
          ) : lastResult !== null ? (
            <motion.div
              key={Math.round(lastResult * 1000)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-baseline gap-2 font-mono text-4xl font-semibold"
            >
              {Number.isInteger(lastResult) ? (
                <AnimatedNumber value={lastResult} />
              ) : (
                <span>{formatNumber(lastResult)}</span>
              )}
              {nlLabel && (
                <span className="text-xs text-muted font-sans ml-2">({nlLabel})</span>
              )}
            </motion.div>
          ) : (
            <span className="text-muted/40 text-4xl font-mono">0</span>
          )}
        </div>

        {resultDecimal > 0 && lastResult !== null && !Number.isInteger(lastResult) && (
          <div className="text-xs text-muted font-mono">
            ≈ {lastResult.toFixed(6)}
          </div>
        )}

        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={handleSubmit}
            disabled={!!error || lastResult === null}
            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white disabled:opacity-40 transition-opacity"
          >
            <CornerDownLeft size={14} />
            Save to history
          </button>
          <button
            onClick={handleBackspace}
            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-white/5 text-muted hover:text-white transition-colors"
          >
            <Delete size={14} />
            Backspace
          </button>
          <span className="ml-auto flex items-center gap-1 text-[11px] text-muted/70">
            <Sparkles size={12} /> Try natural language queries
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {BUTTONS.map((btn) => (
          <button
            key={btn.label}
            onClick={() => handleInput(btn.value)}
            className={`glass glass-hover rounded-xl py-3 text-lg font-mono transition-colors ${
              btn.variant === 'op'
                ? 'text-primary'
                : btn.variant === 'accent'
                ? 'text-red-400'
                : 'text-white'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-3 text-xs text-muted">
        <div className="glass rounded-xl p-3">
          <div className="font-medium text-white mb-1">Keyboard shortcuts</div>
          <div className="flex flex-col gap-1 font-mono">
            <span><kbd className="px-1 py-0.5 bg-white/5 rounded">Enter</kbd> save result</span>
            <span><kbd className="px-1 py-0.5 bg-white/5 rounded">Esc</kbd> clear</span>
            <span><kbd className="px-1 py-0.5 bg-white/5 rounded">Ctrl/⌘ K</kbd> command palette</span>
          </div>
        </div>
        <div className="glass rounded-xl p-3">
          <div className="font-medium text-white mb-1">Example</div>
          <div className="font-mono">(25 + 15) * 2^3</div>
        </div>
        <div className="glass rounded-xl p-3">
          <div className="font-medium text-white mb-1">Natural language</div>
          <div className="font-mono">What is 15% of 2000?</div>
        </div>
      </div>
    </div>
  )
}
