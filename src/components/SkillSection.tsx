import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { skills as fallbackSkills } from '../../data/skills'
import { SkillItem } from '../types'

interface SkillsSectionProps {
  items?: SkillItem[]
}

const SkillsSection = ({ items }: SkillsSectionProps): React.JSX.Element => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)

  const activeSkills = items && items.length > 0 ? items : fallbackSkills
  // Duplicate skills 3 times for a seamless infinite wrap-around
  const displaySkills = [...activeSkills, ...activeSkills, ...activeSkills]

  const isHoveredRef = useRef<boolean>(false)
  const isDraggingRef = useRef<boolean>(false)
  const startXRef = useRef<number>(0)
  const lastXRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const velocityRef = useRef<number>(0)
  const posRef = useRef<number>(0)
  const rafRef = useRef<number | null>(null)

  const [isCursorGrabbing, setIsCursorGrabbing] = useState<boolean>(false)

  // Measure one full loop width (1/3 of total scrollWidth)
  const getLoopWidth = useCallback((): number => {
    if (!trackRef.current) return 0
    return trackRef.current.scrollWidth / 3
  }, [])

  // Continuous animation frame loop
  useEffect(() => {
    let lastFrameTime = performance.now()
    const autoSpeed = 1 // px per frame at 60fps

    const animate = (currentTime: number) => {
      const dt = Math.min((currentTime - lastFrameTime) / 16.667, 2.5) // normalize for high refresh rate
      lastFrameTime = currentTime

      const loopWidth = getLoopWidth()

      if (loopWidth > 0) {
        if (isDraggingRef.current) {
          // Position is directly driven by pointer move
        } else if (Math.abs(velocityRef.current) > 0.05) {
          // Momentum glide after release
          posRef.current -= velocityRef.current * dt
          velocityRef.current *= Math.pow(0.94, dt) // decay velocity
        } else if (!isHoveredRef.current) {
          // Normal auto-scrolling
          posRef.current += autoSpeed * dt
        }

        // Wrap seamlessly within [0, loopWidth)
        if (posRef.current >= loopWidth) {
          posRef.current -= loopWidth
        } else if (posRef.current < 0) {
          posRef.current += loopWidth
        }

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(-${posRef.current}px, 0, 0)`
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [getLoopWidth])

  // Pointer / Touch / Drag Event Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only handle primary button
    if (e.button !== undefined && e.button !== 0) return

    isDraggingRef.current = true
    setIsCursorGrabbing(true)
    const clientX = e.clientX || 0
    startXRef.current = clientX
    lastXRef.current = clientX
    lastTimeRef.current = performance.now()
    velocityRef.current = 0

    if (trackRef.current) {
      trackRef.current.setPointerCapture?.(e.pointerId)
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return

    const clientX = e.clientX || 0
    const now = performance.now()
    const dt = Math.max(now - lastTimeRef.current, 8)
    const deltaX = clientX - lastXRef.current

    // Move track directly by drag distance
    posRef.current -= deltaX

    const loopWidth = getLoopWidth()
    if (loopWidth > 0) {
      if (posRef.current >= loopWidth) posRef.current -= loopWidth
      if (posRef.current < 0) posRef.current += loopWidth
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(-${posRef.current}px, 0, 0)`
    }

    // Compute release velocity
    velocityRef.current = (deltaX / dt) * 16.667

    lastXRef.current = clientX
    lastTimeRef.current = now
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    setIsCursorGrabbing(false)

    if (trackRef.current && e.pointerId) {
      try {
        trackRef.current.releasePointerCapture?.(e.pointerId)
      } catch (_) { }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.9, 0.2, 1] } }
  }

  return (
    <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300 overflow-hidden" aria-label="skills" id="skills">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* Section Title */}
          <motion.div variants={itemVariants}>
            <h2 className="section-title heading-gradient mb-3">Technical Skills</h2>
            <motion.div className="fancy-underline mt-3" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }} style={{ transformOrigin: 'left' }} />
            <p className="section-subtitle">Technologies and tools I work with</p>
          </motion.div>

          {/* Interactive Skills Carousel */}
          <motion.div
            variants={itemVariants}
            ref={containerRef}
            className="relative overflow-hidden pt-6 pb-2 select-none"
            onMouseEnter={() => { isHoveredRef.current = true }}
            onMouseLeave={() => { isHoveredRef.current = false }}
          >
            {/* Gradient overlays for smooth edge fading */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />

            {/* Draggable & Auto-scrolling Track */}
            <div
              ref={trackRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={`flex gap-4 will-change-transform py-4 ${isCursorGrabbing ? 'cursor-grabbing' : 'cursor-grab'
                }`}
              style={{ touchAction: 'pan-y' }}
            >
              {displaySkills.map((skill, idx) => (
                <div
                  key={`${skill.name}-${idx}`}
                  className="flex-shrink-0"
                >
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xl dark:hover:shadow-slate-950/50 transition-shadow duration-300 min-w-[180px] sm:min-w-[200px] h-full flex flex-col items-center justify-center gap-3 group pointer-events-auto"
                  >
                    {/* Icon */}
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300 flex items-center justify-center pointer-events-none">
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        className="w-12 h-12 object-contain pointer-events-none transition-all duration-300 dark:brightness-0 dark:invert"
                        loading="lazy"
                        draggable={false}
                      />
                    </div>

                    {/* Skill Name */}
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-center text-sm pointer-events-none">
                      {skill.name}
                    </h3>

                    {/* Level Badge */}
                    <span className={`text-xs font-medium px-3 py-1 rounded-full pointer-events-none ${skill.level === 'Expert'
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                      {skill.level}
                    </span>

                    {/* Animated indicator on hover */}
                    <div className="w-6 h-0.5 bg-indigo-500 dark:bg-indigo-400 rounded-full group-hover:w-10 transition-all duration-300 pointer-events-none" />
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default SkillsSection