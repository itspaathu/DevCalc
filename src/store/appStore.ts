import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { HistoryEntry, Snippet, ViewKey } from '../types'

interface AppState {
  activeView: ViewKey
  setActiveView: (view: ViewKey) => void

  sidebarCollapsed: boolean
  toggleSidebar: () => void

  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void

  // Calculator state
  expression: string
  setExpression: (expr: string) => void
  lastResult: number | null
  setLastResult: (n: number | null) => void

  // History
  history: HistoryEntry[]
  addHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp' | 'favorite'>) => void
  toggleFavorite: (id: string) => void
  deleteHistoryEntry: (id: string) => void
  clearHistory: () => void

  // Snippets
  snippets: Snippet[]
  addSnippet: (name: string, expression: string) => void
  deleteSnippet: (id: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeView: 'calculator',
      setActiveView: (view) => set({ activeView: view }),

      sidebarCollapsed: false,
      toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),

      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      expression: '',
      setExpression: (expr) => set({ expression: expr }),
      lastResult: null,
      setLastResult: (n) => set({ lastResult: n }),

      history: [],
      addHistory: (entry) =>
        set({
          history: [
            {
              ...entry,
              id: crypto.randomUUID(),
              timestamp: Date.now(),
              favorite: false,
            },
            ...get().history,
          ].slice(0, 500),
        }),
      toggleFavorite: (id) =>
        set({
          history: get().history.map((h) => (h.id === id ? { ...h, favorite: !h.favorite } : h)),
        }),
      deleteHistoryEntry: (id) =>
        set({ history: get().history.filter((h) => h.id !== id) }),
      clearHistory: () => set({ history: [] }),

      snippets: [],
      addSnippet: (name, expression) =>
        set({
          snippets: [
            { id: crypto.randomUUID(), name, expression, createdAt: Date.now() },
            ...get().snippets,
          ],
        }),
      deleteSnippet: (id) => set({ snippets: get().snippets.filter((s) => s.id !== id) }),
    }),
    {
      name: 'devcalc-storage',
      partialize: (state) => ({
        history: state.history,
        snippets: state.snippets,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
)
