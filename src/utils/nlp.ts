// Lightweight natural-language helper. Converts a few common
// phrasings into evaluatable expressions. Returns null if not matched.

export function tryParseNaturalLanguage(input: string): { expression: string; label?: string } | null {
  const text = input.trim().toLowerCase()

  // "what is X% of Y" / "X% of Y"
  let m = text.match(/(?:what is\s+)?([\d.]+)\s*%\s*of\s*([\d.]+)/)
  if (m) {
    const [, pct, of] = m
    return { expression: `(${of} * ${pct}) / 100`, label: `${pct}% of ${of}` }
  }

  // "convert X to binary/hex/octal/decimal"
  m = text.match(/convert\s+([\d.]+)\s+to\s+(binary|hex(?:adecimal)?|octal|decimal)/)
  if (m) {
    const [, num] = m
    return { expression: num, label: `Convert ${num}` }
  }

  // "X plus/minus/times/divided by Y"
  let replaced = text
    .replace(/\bplus\b/g, '+')
    .replace(/\bminus\b/g, '-')
    .replace(/\btimes\b/g, '*')
    .replace(/\bmultiplied by\b/g, '*')
    .replace(/\bdivided by\b/g, '/')
    .replace(/\bover\b/g, '/')
    .replace(/\bsquared\b/g, '^2')
    .replace(/\bcubed\b/g, '^3')
    .replace(/\bto the power of\b/g, '^')
    .replace(/^what is\s+/, '')
    .replace(/\?$/, '')

  if (/^[\d\s+\-*/^%().]+$/.test(replaced) && /[+\-*/^%]/.test(replaced)) {
    return { expression: replaced.trim() }
  }

  return null
}
