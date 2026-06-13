import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, ArrowRight } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { NAV_ITEMS } from '../utils/nav'
import type { ViewKey } from '../types'

export default function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, setActiveView } = useAppStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [commandPaletteOpen])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [commandPaletteOpen, setCommandPaletteOpen])

  const filtered = NAV_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  )

  function go(view: ViewKey) {
    setActiveView(view)
    setCommandPaletteOpen(false)
  }

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCommandPaletteOpen(false)}
        >
          <motion.div
            className="glass w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.96, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <Search size={16} className="text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a tool or command..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted/60"
              />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-muted">ESC</kbd>
            </div>
            <div className="max-h-72 overflow-y-auto scrollbar-thin p-2">
              {filtered.length === 0 && (
                <div className="px-3 py-4 text-sm text-muted text-center">No results</div>
              )}
              {filtered.map((item) => (
                <button
                  key={item.key}
                  onClick={() => go(item.key as ViewKey)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm text-left hover:bg-white/5 transition-colors"
                >
                  <span>{item.label}</span>
                  <ArrowRight size={14} className="text-muted" />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
