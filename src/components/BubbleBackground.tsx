import React, { useEffect, useRef } from 'react'

interface Bubble {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  baseR: number
  alpha: number
  wobble: number
  phase: number
  speedFactor: number
}

interface PointerState {
  x: number
  y: number
  vx: number
  vy: number
}

interface BubbleState {
  bubbles: Bubble[]
  pointer: PointerState
  lastPointer: PointerState | null
  paused: boolean
}

interface ColorPalette {
  BASE_FILL: string
  INNER: string
  MID: string
  RIM: string
  HIGHLIGHT: string
  SHADOW: string
}

export interface BubbleBackgroundProps {
  maxBubbles?: number
  isDark?: boolean
}

// Canvas-based bubble background with lightweight physics and pointer interaction
export default function BubbleBackground({ maxBubbles = 28, isDark = false }: BubbleBackgroundProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const stateRef = useRef<BubbleState>({
    bubbles: [],
    pointer: { x: -9999, y: -9999, vx: 0, vy: 0 },
    lastPointer: null,
    paused: false
  })

  // Live colour palette — updated when isDark changes without remounting
  const colorsRef = useRef<ColorPalette>({
    BASE_FILL: 'rgba(180, 190, 200, 0.12)',
    INNER: 'rgba(255, 255, 255, 0.25)',
    MID: 'rgba(200, 210, 220, 0.10)',
    RIM: 'rgba(120, 130, 150, 0.25)',
    HIGHLIGHT: 'rgba(255, 255, 255, 0.7)',
    SHADOW: 'rgba(0, 0, 0, 0.08)',
  })

  // Update colours when isDark changes
  useEffect(() => {
    if (isDark) {
      colorsRef.current = {
        BASE_FILL: 'rgba(99, 102, 241, 0.08)',      // indigo tint
        INNER: 'rgba(148, 163, 184, 0.20)',           // slate highlight
        MID: 'rgba(71, 85, 105, 0.10)',               // dark mid
        RIM: 'rgba(148, 163, 184, 0.18)',             // slate rim
        HIGHLIGHT: 'rgba(203, 213, 225, 0.75)',       // bright specular
        SHADOW: 'rgba(0, 0, 0, 0.25)',               // deeper shadow in dark
      }
    } else {
      colorsRef.current = {
        BASE_FILL: 'rgba(180, 190, 200, 0.12)',
        INNER: 'rgba(255, 255, 255, 0.25)',
        MID: 'rgba(200, 210, 220, 0.10)',
        RIM: 'rgba(120, 130, 150, 0.25)',
        HIGHLIGHT: 'rgba(255, 255, 255, 0.7)',
        SHADOW: 'rgba(0, 0, 0, 0.08)',
      }
    }
  }, [isDark])

  // Canvas animation setup — runs once on mount
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    const DPR = Math.max(1, window.devicePixelRatio || 1)

    function resize() {
      if (!canvas || !ctx) return
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * DPR)
      canvas.height = Math.floor(height * DPR)
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }

    function rand(min: number, max: number): number {
      return Math.random() * (max - min) + min
    }

    function initBubbles() {
      const area = width * height
      const density = 28000 // one bubble per ~28k px
      const count = Math.max(8, Math.min(maxBubbles, Math.floor(area / density)))
      const bubbles: Bubble[] = []
      for (let i = 0; i < count; i++) {
        const r = rand(18, 72) * (width < 480 ? 0.6 : 1)
        const b: Bubble = {
          x: rand(r, width - r),
          y: rand(r, height - r),
          vx: rand(-0.2, 0.2),
          vy: rand(-0.12, 0.12),
          r,
          baseR: r,
          alpha: rand(0.06, 0.16),
          wobble: rand(0.001, 0.006),
          phase: rand(0, Math.PI * 2),
          speedFactor: rand(0.5, 1.3)
        }
        bubbles.push(b)
      }
      stateRef.current.bubbles = bubbles
    }

    function applyBounds(b: Bubble) {
      if (b.x - b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx) * 0.8 }
      if (b.x + b.r > width) { b.x = width - b.r; b.vx = -Math.abs(b.vx) * 0.8 }
      if (b.y - b.r < 0) { b.y = b.r; b.vy = Math.abs(b.vy) * 0.8 }
      if (b.y + b.r > height) { b.y = height - b.r; b.vy = -Math.abs(b.vy) * 0.8 }
    }

    function step() {
      if (!ctx) return
      const s = stateRef.current
      const p = s.pointer

      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < s.bubbles.length; i++) {
        const b = s.bubbles[i]

        b.phase += b.wobble
        b.x += b.vx * b.speedFactor + Math.cos(b.phase) * 0.06
        b.y += b.vy * b.speedFactor + Math.sin(b.phase) * 0.04

        const dx = p.x - b.x
        const dy = p.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const influence = Math.max(0, 1 - dist / (200 + b.r))
        if (influence > 0 && p.x > -9000) {
          const pushStrength = (Math.hypot(p.vx, p.vy) * 0.7 + 0.6) * influence
          const ux = dx / (dist + 0.001)
          const uy = dy / (dist + 0.001)
          const repel = Math.hypot(p.vx, p.vy) > 1.2
          const sign = repel ? -1 : 1
          b.vx += ux * sign * pushStrength * 0.35
          b.vy += uy * sign * pushStrength * 0.35
        }

        b.vx *= 0.995
        b.vy *= 0.995

        applyBounds(b)

        const pulse = 1 + Math.sin(b.phase * 0.5) * 0.03
        const drawR = b.baseR * pulse

        const C = colorsRef.current
        const grad = ctx.createRadialGradient(b.x - drawR * 0.12, b.y - drawR * 0.12, drawR * 0.06, b.x, b.y, drawR)
        grad.addColorStop(0, C.INNER)
        grad.addColorStop(0.25, C.MID)
        grad.addColorStop(0.8, C.BASE_FILL)
        grad.addColorStop(1, 'rgba(180,190,200,0.02)')

        ctx.save()
        ctx.shadowColor = C.SHADOW
        ctx.shadowBlur = Math.max(6, drawR * 0.14)
        ctx.beginPath()
        ctx.fillStyle = grad
        ctx.arc(b.x, b.y, drawR, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        ctx.beginPath()
        ctx.lineWidth = Math.max(1, drawR * 0.02)
        ctx.strokeStyle = C.RIM
        ctx.globalCompositeOperation = 'source-over'
        ctx.stroke()

        const hlR = Math.max(2, drawR * 0.18)
        ctx.beginPath()
        ctx.fillStyle = C.HIGHLIGHT
        ctx.globalAlpha = 0.7
        ctx.arc(b.x - drawR * 0.36, b.y - drawR * 0.36, hlR, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }

      p.vx *= 0.92
      p.vy *= 0.92

      rafRef.current = requestAnimationFrame(step)
    }

    let lastMouse = { x: 0, y: 0, t: 0 }
    function onPointerMove(e: MouseEvent | TouchEvent) {
      const p = stateRef.current.pointer
      const touch = 'touches' in e && e.touches.length > 0 ? e.touches[0] : null
      const x = touch ? touch.clientX : (e as MouseEvent).clientX
      const y = touch ? touch.clientY : (e as MouseEvent).clientY
      const now = performance.now()
      const dt = Math.max(8, now - (lastMouse.t || now))
      p.vx = (x - lastMouse.x) / dt * 16
      p.vy = (y - lastMouse.y) / dt * 16
      p.x = x
      p.y = y
      lastMouse = { x, y, t: now }
    }

    function onPointerLeave() {
      stateRef.current.pointer.x = -99999
      stateRef.current.pointer.y = -99999
      stateRef.current.pointer.vx = 0
      stateRef.current.pointer.vy = 0
    }

    let lastVelocity = 0
    function maybeShock() {
      const p = stateRef.current.pointer
      const vel = Math.hypot(p.vx, p.vy)
      if (vel - lastVelocity > 3) {
        for (let b of stateRef.current.bubbles) {
          const dx = p.x - b.x
          const dy = p.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 300) {
            const k = (1 - dist / 300) * 6
            b.vx += (dx / (dist + 0.01)) * -k
            b.vy += (dy / (dist + 0.01)) * -k
          }
        }
      }
      lastVelocity = vel
    }

    function onVisibilityChange() {
      const hidden = document.hidden
      stateRef.current.paused = hidden
      if (hidden) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
      } else {
        if (!rafRef.current) rafRef.current = requestAnimationFrame(step)
      }
    }

    resize()
    if (!stateRef.current.bubbles || stateRef.current.bubbles.length === 0) initBubbles()

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove as EventListener, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('touchmove', onPointerMove as EventListener, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)

    rafRef.current = requestAnimationFrame(step)
    const shockInterval = setInterval(maybeShock, 120)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove as EventListener)
      window.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('touchmove', onPointerMove as EventListener)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      clearInterval(shockInterval)
    }
  }, [maxBubbles])

  return (
    <canvas
      ref={canvasRef}
      className="bubble-canvas"
      aria-hidden
    />
  )
}
