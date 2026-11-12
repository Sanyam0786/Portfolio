import React, { useState, useEffect } from 'react'
import './Intro.css'

export interface IntroProps {
  name: string
  onDone: () => void
}

export default function Intro({ name, onDone }: IntroProps): React.JSX.Element | null {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Respect prefers-reduced-motion: skip intro and finish immediately
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches) {
      onDone()
      return
    }

    // Lock page scroll while intro is playing
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.scrollTo(0, 0)

    // Sequence timing:
    // 0ms -> 800ms: drop falls (0.8s)
    // 800ms -> 2600ms: white circular reveal expands (1.8s)
    // 2600ms -> 3300ms: brief hold on screen (0.7s)
    // 3300ms: apply exit class -> snappy 0.45s overlay fade-out begins
    // 3750ms: intro completes, onDone is called
    const exitTimer = setTimeout(() => {
      setIsExiting(true)
    }, 3300)

    const doneTimer = setTimeout(() => {
      document.body.style.overflow = originalOverflow || ''
      onDone()
    }, 3750)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
      document.body.style.overflow = originalOverflow || ''
    }
  }, [onDone])

  return (
    <div
      className={`intro-overlay ${isExiting ? 'is-exiting' : ''}`}
      aria-hidden="true"
    >
      <div className="intro-stage">
        {/* Falling white glowing drop */}
        <div className="intro-drop" />

        {/* Stacked copies of the name and subtext in CSS grid */}
        <div className="intro-content-grid">
          {/* Base copy in pure black (#000) matching background */}
          <div className="intro-content-base">
            <h1 className="intro-name">{name}</h1>
            <p className="intro-subtext">PORTFOLIO</p>
          </div>

          {/* White copy revealed via expanding circular clip-path with wave shimmer */}
          <div className="intro-content-reveal">
            <h1 className="intro-name">{name}</h1>
            <p className="intro-subtext">PORTFOLIO</p>
          </div>
        </div>
      </div>
    </div>
  )
}
