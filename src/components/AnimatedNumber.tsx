import { useEffect, useRef, useState } from 'react'

interface AnimatedNumberProps {
  value: number
  className?: string
  decimals?: number
}

export default function AnimatedNumber({ value, className, decimals = 0 }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const rafRef = useRef<number>()

  useEffect(() => {
    const from = fromRef.current
    const to = value
    const duration = 350
    const start = performance.now()

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(from + (to - from) * eased)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = to
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value])

  return (
    <span className={className}>
      {decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString()}
    </span>
  )
}
