import {
  Calculator, Binary, ToggleLeft, Hash, Braces, Regex, Code2, Clock,
  History, Bookmark, Settings, ChevronsLeft, ChevronsRight, Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { NAV_ITEMS } from '../utils/nav'
import type { ViewKey } from '../types'

const ICONS: Record<string, LucideIcon> = {
  Calculator, Binary, ToggleLeft, Hash, Braces, Regex, Code2, Clock, History, Bookmark, Settings,
}

const GROUP_LABELS: Record<string, string> = {
  main: 'Workspace',
  tools: 'Dev Tools',
  system: 'System',
}

export default function Sidebar() {
  const { activeView, setActiveView, sidebarCollapsed, toggleSidebar } = useAppStore()

  const groups: Array<'main' | 'tools' | 'system'> = ['main', 'tools', 'system']

  return (
    <aside
      className={`glass flex flex-col h-full transition-all duration-200 rounded-2xl m-2 mr-0 ${
        sidebarCollapsed ? 'w-[68px]' : 'w-[220px]'
      }`}
    >
      <div className="flex items-center gap-2 px-4 py-4 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
          <Sparkles size={16} className="text-white" />
        </div>
        {!sidebarCollapsed && (
          <span className="font-semibold text-sm tracking-wide gradient-text">DevCalc</span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-3 space-y-4">
        {groups.map((group) => (
          <div key={group}>
            {!sidebarCollapsed && (
              <div className="px-2 mb-1 text-[10px] uppercase tracking-widest text-muted/70 font-medium">
                {GROUP_LABELS[group]}
              </div>
            )}
            <div className="space-y-0.5">
              {NAV_ITEMS.filter((i) => i.group === group).map((item) => {
                const Icon = ICONS[item.icon]
                const active = activeView === item.key
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveView(item.key as ViewKey)}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                      active
                        ? 'bg-gradient-to-r from-primary/20 to-secondary/10 text-white border border-primary/30'
                        : 'text-muted hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                    title={item.label}
                  >
                    <Icon size={16} className={active ? 'text-primary' : ''} />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-2 border-t border-white/5">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 px-2.5 py-2 rounded-lg text-muted hover:text-white hover:bg-white/5 text-sm transition-colors"
        >
          {sidebarCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
