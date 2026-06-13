import type { NavItem } from '../types'

export const NAV_ITEMS: NavItem[] = [
  { key: 'calculator', label: 'Calculator', icon: 'Calculator', group: 'main' },
  { key: 'converters', label: 'Converters', icon: 'Binary', group: 'main' },
  { key: 'bitwise', label: 'Bitwise', icon: 'ToggleLeft', group: 'main' },
  { key: 'hash', label: 'Hash Tools', icon: 'Hash', group: 'tools' },
  { key: 'json', label: 'JSON Tools', icon: 'Braces', group: 'tools' },
  { key: 'regex', label: 'Regex Tester', icon: 'Regex', group: 'tools' },
  { key: 'encoders', label: 'Encoders', icon: 'Code2', group: 'tools' },
  { key: 'timestamp', label: 'Timestamp', icon: 'Clock', group: 'tools' },
  { key: 'history', label: 'History', icon: 'History', group: 'system' },
  { key: 'snippets', label: 'Snippets', icon: 'Bookmark', group: 'system' },
  { key: 'settings', label: 'Settings', icon: 'Settings', group: 'system' },
]
