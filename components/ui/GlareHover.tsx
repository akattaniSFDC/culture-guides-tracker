"use client"

import React, { useRef, useCallback, useEffect } from 'react'
import { gsap } from 'gsap'

interface GlareHoverProps {
  children: React.ReactNode
  glareColor?: string
  glareOpacity?: number
  glareAngle?: number
  glareSize?: number
  duration?: number
  playOnce?: boolean
  className?: string
}

const GlareHover: React.FC<GlareHoverProps> = ({
  children,
  glareColor = '#ffffff',
  glareOpacity = 0.3,
  glareAngle = -30,
  glareSize = 120,
  duration = 0.6,
  playOnce = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const hasPlayed = useRef(false)

  useEffect(() => {
    if (glareRef.current) {
      // Initialize glare position off-screen to the left
      gsap.set(glareRef.current, {
        x: '-100%',
        opacity: glareOpacity,
      })
    }
  }, [glareOpacity])

  const handleMouseEnter = useCallback(() => {
    if (playOnce && hasPlayed.current) return
    if (!glareRef.current || !containerRef.current) return

    // Get container width for proper animation bounds
    const containerWidth = containerRef.current.offsetWidth

    // Animate glare from left (-100%) to right (beyond container width)
    gsap.fromTo(
      glareRef.current,
      {
        x: `-${glareSize}px`,
        opacity: glareOpacity,
      },
      {
        x: containerWidth + glareSize,
        duration,
        ease: 'power2.out',
        onComplete: () => {
          if (playOnce) hasPlayed.current = true
        },
      }
    )
  }, [playOnce, glareSize, duration, glareOpacity])

  const glareStyle: React.CSSProperties = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: `${glareSize}px`,
    height: '100%',
    background: `linear-gradient(${glareAngle}deg, transparent 0%, ${glareColor} 50%, transparent 100%)`,
    pointerEvents: 'none',
    zIndex: 10,
    transform: `skew(${glareAngle}deg)`,
    borderRadius: 'inherit',
    overflow: 'hidden',
  }

  return (
    <div
      ref={containerRef}
      className={`relative inline-block overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      style={{ 
        position: 'relative',
        display: 'inline-block',
        borderRadius: 'inherit',
      }}
    >
      {children}
      <div
        ref={glareRef}
        style={glareStyle}
      />
    </div>
  )
}

export default GlareHover