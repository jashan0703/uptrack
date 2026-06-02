import { cn } from "@/lib/utils"

interface WorkPulseLogoProps {
  /** Tailwind sizing classes for the square mark (default h-8 w-8). */
  className?: string
  /** Render the "WorkPulse" wordmark next to the mark. */
  showWordmark?: boolean
  /** Extra classes for the wordmark text. */
  wordmarkClassName?: string
  /** Continuously animate the pulse line being drawn. */
  animated?: boolean
}

/**
 * WorkPulse brand mark: a "W" drawn as an activity/heartbeat pulse line inside
 * a gradient rounded square — tying together "Work" + "Pulse".
 */
export function WorkPulseLogo({
  className,
  showWordmark = false,
  wordmarkClassName,
  animated = false,
}: WorkPulseLogoProps) {
  return (
    <div className="flex items-center gap-2">
      <svg
        viewBox="0 0 32 32"
        role="img"
        aria-label="WorkPulse logo"
        className={cn("h-8 w-8", className)}
      >
        <defs>
          <linearGradient id="wp-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="55%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#5b21b6" />
          </linearGradient>
        </defs>

        {/* Rounded square brand background */}
        <rect x="0" y="0" width="32" height="32" rx="8" fill="url(#wp-grad)" />

        {/* Soft baseline of the pulse for depth */}
        <path
          d="M4 16 H28"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.25"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* The pulse that forms a "W" */}
        <path
          d="M4 16 H9 L10.5 9 L13 23 L16 13 L19 23 L21.5 9 L23 16 H28"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animated ? "animate-pulse-draw" : undefined}
        />
      </svg>

      {showWordmark && (
        <span className={cn("text-lg font-semibold tracking-tight text-foreground", wordmarkClassName)}>
          Work<span className="text-primary">Pulse</span>
        </span>
      )}
    </div>
  )
}
