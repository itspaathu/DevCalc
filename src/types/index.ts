export type ViewKey =
  | 'calculator'
  | 'converters'
  | 'bitwise'
  | 'hash'
  | 'json'
  | 'regex'
  | 'encoders'
  | 'timestamp'
  | 'history'
  | 'snippets'
  | 'settings'

export interface HistoryEntry {
  id: string
  expression: string
  result: string
  timestamp: number
  favorite: boolean
}

export interface Snippet {
  id: string
  name: string
  expression: string
  createdAt: number
}

export interface NavItem {
  key: ViewKey
  label: string
  icon: string
  group: 'main' | 'tools' | 'system'
}
