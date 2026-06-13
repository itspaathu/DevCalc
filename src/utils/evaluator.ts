// A small, safe arithmetic expression evaluator supporting
// + - * / % ^ () and decimals. No eval() used.

type TokenType = 'num' | 'op' | 'lparen' | 'rparen'

interface Token {
  type: TokenType
  value: string
}

const OPERATORS = ['+', '-', '*', '/', '%', '^']

function tokenize(expr: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  const clean = expr.replace(/\s+/g, '')

  while (i < clean.length) {
    const c = clean[i]

    if (c === '(') {
      tokens.push({ type: 'lparen', value: c })
      i++
      continue
    }
    if (c === ')') {
      tokens.push({ type: 'rparen', value: c })
      i++
      continue
    }
    if (OPERATORS.includes(c)) {
      // handle unary minus
      if (
        c === '-' &&
        (tokens.length === 0 ||
          tokens[tokens.length - 1].type === 'op' ||
          tokens[tokens.length - 1].type === 'lparen')
      ) {
        // collect number with leading minus
        let j = i + 1
        let numStr = '-'
        while (j < clean.length && /[0-9.]/.test(clean[j])) {
          numStr += clean[j]
          j++
        }
        if (numStr === '-') throw new Error('Invalid expression')
        tokens.push({ type: 'num', value: numStr })
        i = j
        continue
      }
      tokens.push({ type: 'op', value: c })
      i++
      continue
    }
    if (/[0-9.]/.test(c)) {
      let j = i
      let numStr = ''
      while (j < clean.length && /[0-9.]/.test(clean[j])) {
        numStr += clean[j]
        j++
      }
      tokens.push({ type: 'num', value: numStr })
      i = j
      continue
    }
    throw new Error(`Unexpected character: ${c}`)
  }

  return tokens
}

function precedence(op: string): number {
  switch (op) {
    case '^':
      return 4
    case '*':
    case '/':
    case '%':
      return 3
    case '+':
    case '-':
      return 2
    default:
      return 0
  }
}

function applyOp(a: number, b: number, op: string): number {
  switch (op) {
    case '+':
      return a + b
    case '-':
      return a - b
    case '*':
      return a * b
    case '/':
      if (b === 0) throw new Error('Division by zero')
      return a / b
    case '%':
      return a % b
    case '^':
      return Math.pow(a, b)
    default:
      throw new Error(`Unknown operator: ${op}`)
  }
}

// Shunting-yard -> RPN -> evaluate
export function evaluateExpression(expr: string): number {
  if (!expr || !expr.trim()) throw new Error('Empty expression')

  const tokens = tokenize(expr)
  const output: Token[] = []
  const opStack: Token[] = []

  for (const token of tokens) {
    if (token.type === 'num') {
      output.push(token)
    } else if (token.type === 'op') {
      while (
        opStack.length &&
        opStack[opStack.length - 1].type === 'op' &&
        (token.value === '^'
          ? precedence(opStack[opStack.length - 1].value) > precedence(token.value)
          : precedence(opStack[opStack.length - 1].value) >= precedence(token.value))
      ) {
        output.push(opStack.pop()!)
      }
      opStack.push(token)
    } else if (token.type === 'lparen') {
      opStack.push(token)
    } else if (token.type === 'rparen') {
      while (opStack.length && opStack[opStack.length - 1].type !== 'lparen') {
        output.push(opStack.pop()!)
      }
      if (!opStack.length) throw new Error('Mismatched parentheses')
      opStack.pop()
    }
  }
  while (opStack.length) {
    const t = opStack.pop()!
    if (t.type === 'lparen' || t.type === 'rparen') throw new Error('Mismatched parentheses')
    output.push(t)
  }

  // Evaluate RPN
  const stack: number[] = []
  for (const token of output) {
    if (token.type === 'num') {
      stack.push(parseFloat(token.value))
    } else {
      const b = stack.pop()
      const a = stack.pop()
      if (a === undefined || b === undefined) throw new Error('Invalid expression')
      stack.push(applyOp(a, b, token.value))
    }
  }

  if (stack.length !== 1) throw new Error('Invalid expression')
  const result = stack[0]
  if (!isFinite(result)) throw new Error('Result is not finite')
  return result
}

export function formatNumber(n: number): string {
  if (Number.isInteger(n)) return n.toString()
  // limit to a reasonable precision
  return parseFloat(n.toFixed(10)).toString()
}
