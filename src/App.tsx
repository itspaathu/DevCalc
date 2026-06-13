import { AnimatePresence, motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import Sidebar from './components/Sidebar'
import CommandPalette from './components/CommandPalette'
import InsightsPanel from './components/InsightsPanel'
import { useAppStore } from './store/appStore'
import CalculatorPage from './pages/CalculatorPage'
import ConvertersPage from './pages/ConvertersPage'
import BitwisePage from './pages/BitwisePage'
import HashPage from './pages/HashPage'
import JsonPage from './pages/JsonPage'
import RegexPage from './pages/RegexPage'
import EncodersPage from './pages/EncodersPage'
import TimestampPage from './pages/TimestampPage'
import HistoryPage from './pages/HistoryPage'
import SnippetsPage from './pages/SnippetsPage'
import SettingsPage from './pages/SettingsPage'

const PAGES: Record<string, React.ComponentType> = {
  calculator: CalculatorPage,
  converters: ConvertersPage,
  bitwise: BitwisePage,
  hash: HashPage,
  json: JsonPage,
  regex: RegexPage,
  encoders: EncodersPage,
  timestamp: TimestampPage,
  history: HistoryPage,
  snippets: SnippetsPage,
  settings: SettingsPage,
}

export default function App() {
  const { activeView, setCommandPaletteOpen } = useAppStore()
  const Page = PAGES[activeView] ?? CalculatorPage

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 m-2 mb-0 glass rounded-2xl">
          <button className="text-muted hover:text-white lg:hidden" onClick={() => {}}>
            <Menu size={18} />
          </button>
          <div className="text-sm text-muted hidden sm:block">
            DevCalc <span className="text-muted/40">/</span>{' '}
            <span className="text-white capitalize">{activeView}</span>
          </div>
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-white/5 text-muted hover:text-white transition-colors"
          >
            <span>Search</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-[10px]">Ctrl K</kbd>
          </button>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <Page />
              </motion.div>
            </AnimatePresence>
          </div>
          <InsightsPanel />
        </div>
      </main>

      <CommandPalette />
    </div>
  )
}
