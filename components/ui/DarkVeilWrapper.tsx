"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import DarkVeil from "./DarkVeil"

export default function DarkVeilWrapper() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Don't show on loading screens or if we're not in a proper page route
  const isLoadingPage = !pathname || pathname === '/loading'

  // Only show DarkVeil in dark mode and not on loading pages
  const isDark = theme === "dark" || resolvedTheme === "dark"

  if (!isDark || isLoadingPage) {
    return null
  }

  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-none" style={{ zIndex: -999 }}>
      <DarkVeil
        hueShift={210}
        noiseIntensity={0.04}
        scanlineIntensity={0}
        speed={0.3}
        scanlineFrequency={0}
        warpAmount={0.2}
        resolutionScale={1.0}
      />
    </div>
  )
}