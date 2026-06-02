"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface RevealProps {
  children: React.ReactNode
  className?: string
  /** Delay in ms before the reveal animation starts once in view. */
  delay?: number
  /** Render as a different element if needed (defaults to div). */
  as?: React.ElementType
}

/**
 * Fades + slides its children in the first time they scroll into view.
 * Uses IntersectionObserver so it stays cheap and only fires once.
 */
export function Reveal({ children, className, delay = 0, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "transition-none",
        visible ? "animate-fade-up" : "opacity-0",
        className,
      )}
    >
      {children}
    </Tag>
  )
}
