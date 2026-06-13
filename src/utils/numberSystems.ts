export type Base = 'bin' | 'oct' | 'dec' | 'hex'

const BASE_RADIX: Record<Base, number> = {
  bin: 2,
  oct: 8,
  dec: 10,
  hex: 16,
}

export function isValidInBase(value: string, base: Base): boolean {
  if (value.trim() === '') return true
  const patterns: Record<Base, RegExp> = {
    bin: /^-?[01]+$/,
    oct: /^-?[0-7]+$/,
    dec: /^-?[0-9]+$/,
    hex: /^-?[0-9a-fA-F]+$/,
  }
  return patterns[base].test(value.trim())
}

export function parseFromBase(value: string, base: Base): bigint | null {
  const trimmed = value.trim()
  if (trimmed === '' || !isValidInBase(trimmed, base)) return null
  try {
    const negative = trimmed.startsWith('-')
    const raw = negative ? trimmed.slice(1) : trimmed
    let result = 0n
    const radix = BigInt(BASE_RADIX[base])
    for (const ch of raw.toLowerCase()) {
      const digit = parseInt(ch, BASE_RADIX[base])
      if (isNaN(digit)) return null
      result = result * radix + BigInt(digit)
    }
    return negative ? -result : result
  } catch {
    return null
  }
}

export function formatToBase(value: bigint, base: Base): string {
  if (base === 'dec') return value.toString(10)
  const negative = value < 0n
  let v = negative ? -value : value
  if (v === 0n) return '0'
  const digits = '0123456789abcdef'
  const radix = BigInt(BASE_RADIX[base])
  let out = ''
  while (v > 0n) {
    out = digits[Number(v % radix)] + out
    v = v / radix
  }
  return (negative ? '-' : '') + (base === 'hex' ? out.toUpperCase() : out)
}

export interface AllBaseValues {
  bin: string
  oct: string
  dec: string
  hex: string
}

export function convertAll(value: bigint): AllBaseValues {
  return {
    bin: formatToBase(value, 'bin'),
    oct: formatToBase(value, 'oct'),
    dec: formatToBase(value, 'dec'),
    hex: formatToBase(value, 'hex'),
  }
}

export function toBinaryPadded(value: bigint, bits = 8): string {
  const negative = value < 0n
  const v = negative ? -value : value
  let bin = v.toString(2)
  if (bin.length < bits) bin = bin.padStart(bits, '0')
  return (negative ? '-' : '') + bin
}
