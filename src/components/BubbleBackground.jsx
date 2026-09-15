import React, { useEffect, useRef } from 'react'

// Canvas-based bubble background with lightweight physics and pointer interaction
export default function BubbleBackground({ maxBubbles = 28, isDark = false }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const stateRef = useRef({ bubbles: [], pointer: { x: -9999, y: -9999, vx: 0, vy: 0 }, lastPointer: null, paused: false })
  // Live colour palette — updated when isDark changes without remounting
  // Pre-initialized with light palette so canvas is never empty on first render
  const colorsRef = useRef({
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

    let width = 0
    let height = 0
    const DPR = Math.max(1, window.devicePixelRatio || 1)

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * DPR)
      canvas.height = Math.floor(height * DPR)
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      // NOTE: do NOT reinitialize bubbles on resize — keep positions stable
      // Canvas size is updated; bubbles keep their positions until a full reload
    }

    // Colour constants are now read from colorsRef.current (set by the isDark effect above)

    function rand(min, max) { return Math.random() * (max - min) + min }

    function initBubbles() {
      const area = width * height
      const density = 28000 // one bubble per ~28k px
      const count = Math.max(8, Math.min(maxBubbles, Math.floor(area / density)))
      const bubbles = []
      for (let i = 0; i < count; i++) {
        const r = rand(18, 72) * (width < 480 ? 0.6 : 1)
        const b = {
          x: rand(r, width - r),
          y: rand(r, height - r),
          vx: rand(-0.2, 0.2),
          vy: rand(-0.12, 0.12),
          r,
          baseR: r,
          alpha: rand(0.06, 0.16),
          // hueIdx removed - using neutral cool grayscale palette
          wobble: rand(0.001, 0.006),
          phase: rand(0, Math.PI * 2),
          speedFactor: rand(0.5, 1.3)
        }
        bubbles.push(b)
      }
      stateRef.current.bubbles = bubbles
    }

    function applyBounds(b) {
      // bounce off walls with soft damping
      if (b.x - b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx) * 0.8 }
      if (b.x + b.r > width) { b.x = width - b.r; b.vx = -Math.abs(b.vx) * 0.8 }
      if (b.y - b.r < 0) { b.y = b.r; b.vy = Math.abs(b.vy) * 0.8 }
      if (b.y + b.r > height) { b.y = height - b.r; b.vy = -Math.abs(b.vy) * 0.8 }
    }

    function step() {
      const s = stateRef.current
      const p = s.pointer

      // gentle background clear with slight alpha for motion trails
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < s.bubbles.length; i++) {
        const b = s.bubbles[i]

        // organic wobble
        b.phase += b.wobble
        b.x += b.vx * b.speedFactor + Math.cos(b.phase) * 0.06
        b.y += b.vy * b.speedFactor + Math.sin(b.phase) * 0.04

        // pointer interaction (magnetic + push)
        const dx = p.x - b.x
        const dy = p.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const influence = Math.max(0, 1 - dist / (200 + b.r))
        if (influence > 0 && p.x > -9000) {
          // near pointer: apply force away proportional to pointer speed and closeness
          const pushStrength = (Math.hypot(p.vx, p.vy) * 0.7 + 0.6) * influence
          const ux = dx / (dist + 0.001)
          const uy = dy / (dist + 0.001)
          // decide attract or repel: subtle attract for slow pointer, repel for fast
          const repel = Math.hypot(p.vx, p.vy) > 1.2
          const sign = repel ? -1 : 1
          b.vx += ux * sign * pushStrength * 0.35
          b.vy += uy * sign * pushStrength * 0.35
        }

        // friction
        b.vx *= 0.995
        b.vy *= 0.995

        applyBounds(b)

        // subtle size pulse
        const pulse = 1 + Math.sin(b.phase * 0.5) * 0.03
        const drawR = b.baseR * pulse

        // draw bubble with soft radial gradient — reads live palette from colorsRef
        const C = colorsRef.current
        const grad = ctx.createRadialGradient(b.x - drawR * 0.12, b.y - drawR * 0.12, drawR * 0.06, b.x, b.y, drawR)
        // inner highlight
        grad.addColorStop(0, C.INNER)
        // mid transition
        grad.addColorStop(0.25, C.MID)
        // base fill
        grad.addColorStop(0.8, C.BASE_FILL)
        // subtle fade at edges
        grad.addColorStop(1, 'rgba(180,190,200,0.02)')

        // apply soft outer shadow for depth
        ctx.save()
        ctx.shadowColor = C.SHADOW
        ctx.shadowBlur = Math.max(6, drawR * 0.14)
        ctx.beginPath()
        ctx.fillStyle = grad
        ctx.arc(b.x, b.y, drawR, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // rim stroke for subtle edge definition
        ctx.beginPath()
        ctx.lineWidth = Math.max(1, drawR * 0.02)
        ctx.strokeStyle = C.RIM
        ctx.globalCompositeOperation = 'source-over'
        ctx.stroke()

        // small specular highlight reflection
        const hlR = Math.max(2, drawR * 0.18)
        ctx.beginPath()
        ctx.fillStyle = C.HIGHLIGHT
        ctx.globalAlpha = 0.7
        ctx.arc(b.x - drawR * 0.36, b.y - drawR * 0.36, hlR, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }

      // decay pointer velocity
      p.vx *= 0.92
      p.vy *= 0.92

      rafRef.current = requestAnimationFrame(step)
    }

    // pointer handlers
    let lastMouse = { x: 0, y: 0, t: 0 }
    function onPointerMove(e) {
      const p = stateRef.current.pointer
      const x = e.touches ? e.touches[0].clientX : e.clientX
      const y = e.touches ? e.touches[0].clientY : e.clientY
      const now = performance.now()
      const dt = Math.max(8, now - (lastMouse.t || now))
      p.vx = (x - lastMouse.x) / dt * 16
      p.vy = (y - lastMouse.y) / dt * 16
      p.x = x
      p.y = y
      lastMouse = { x, y, t: now }
    }

    function onPointerLeave() {
      // move pointer far away to stop influence
      stateRef.current.pointer.x = -99999
      stateRef.current.pointer.y = -99999
      stateRef.current.pointer.vx = 0
      stateRef.current.pointer.vy = 0
    }

    // ripple on fast movement
    let lastVelocity = 0
    function maybeShock() {
      const p = stateRef.current.pointer
      const vel = Math.hypot(p.vx, p.vy)
      if (vel - lastVelocity > 3) {
        // push nearby bubbles more strongly
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

    // initialization: set canvas size first, then initialize bubbles once
    resize()
    // initialize bubbles only once on mount — do not re-run on resize
    if (!stateRef.current.bubbles || stateRef.current.bubbles.length === 0) initBubbles()

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('touchmove', onPointerMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)

    // device orientation gentle parallax (optional, low amplitude)
    function onDeviceOrientation(ev) {
      if (!ev || typeof ev.gamma === 'undefined') return
      const p = stateRef.current.pointer
      // small offset based on tilt
      p.x = width / 2 + (ev.gamma || 0) * 3
      p.y = height / 2 + (ev.beta || 0) * 2
    }
    window.addEventListener('deviceorientation', onDeviceOrientation, true)

    rafRef.current = requestAnimationFrame(step)

    // small interval to check for shockwaves
    const shockInterval = setInterval(maybeShock, 120)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('touchmove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('deviceorientation', onDeviceOrientation)
      cancelAnimationFrame(rafRef.current)
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
