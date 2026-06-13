# DevCalc — The Developer's Calculator

A calculator, developer toolkit, and number system explorer combined into one elegant,
keyboard-first web app. Built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, and Zustand.

![DevCalc](public/favicon.svg)

## Features

- **Standard Calculator** — arithmetic with `+ - * / % ^ ()`, decimals, and a live result preview.
- **Natural Language** — `What is 15% of 2000?`
- **Number System Explorer** — live, bidirectional conversion between binary, octal, decimal, and hex.
- **Bitwise Playground** — AND / OR / XOR / NOT / shifts with animated bit visualization.
- **Developer Utilities**
  - Base64 & URL encode/decode
  - MD5 / SHA-1 / SHA-256 hash generator
  - JSON formatter (beautify/minify)
  - Regex tester with live highlighting and presets
  - Unix timestamp converter
- **Persistent History** — grouped by Today / Yesterday / Last Week, searchable, favoritable.
- **Saved Snippets** — store and re-run reusable expressions.
- **Command Palette** — `Ctrl/⌘ + K` to jump anywhere.
- **Insights Panel** — live binary/hex/octal breakdown and bit visualization of your current result.

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS (dark glassmorphism theme)
- Framer Motion for animations
- Zustand (with localStorage persistence) for state
- Lucide React icons

## Getting Started

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser.

### Build for production

```bash
npm run build
npm run preview
```

## Deploying to Vercel

1. Push this repository to GitHub.
2. Import the repo into [Vercel](https://vercel.com/new).
3. Framework preset: **Vite**. No extra configuration is required.

## Project Structure

```text
src/
 ├── components/   # Sidebar, command palette, insights panel, shared UI
 ├── pages/         # Calculator, converters, bitwise, hash, json, regex, etc.
 ├── store/         # Zustand store (history, snippets, UI state)
 ├── types/         # Shared TypeScript types
 └── utils/         # Expression evaluator, number system + crypto helpers
```

## License

MIT
