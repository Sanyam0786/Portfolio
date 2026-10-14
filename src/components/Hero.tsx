import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { featuresSentences as fallbackSentences } from '../../data/home'

export interface HeroProps {
  onContactOpen?: () => void
  sentences?: string[]
}

export default function Hero({ onContactOpen, sentences }: HeroProps): React.JSX.Element {
  const activeSentences = sentences && sentences.length > 0 ? sentences : fallbackSentences
  const [current, setCurrent] = useState<number>(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSentences.length)
    }, 5000) // Change every 5 seconds
    return () => clearInterval(interval)
  }, [activeSentences.length])

  const textVariants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 40 : -40,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      y: direction < 0 ? 40 : -40,
      opacity: 0
    })
  }

  return (
    <section className="min-h-[70vh] flex items-center relative bg-canvas overflow-hidden" aria-label="hero" id="hero">
      <div className="max-w-4xl mx-auto px-6 w-full">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.2, 0.9, 0.2, 1] }}
        >
          {/* Cycling headline with premium animations */}
          <div className="relative h-24 sm:h-32 mb-2 flex items-center">
            <AnimatePresence mode="wait" custom={1}>
              <motion.h1
                key={current}
                custom={1}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  y: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.5 }
                }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight absolute w-full"
              >
                <span className="gradient-text block">{activeSentences[current]}</span>
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Cycle indicators */}
          <div className="flex gap-2 mt-8 mb-6 ">
            {activeSentences.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => setCurrent(idx)}
                className="h-2 bg-slate-300 rounded-full transition-all duration-300"
                animate={{
                  width: current === idx ? 24 : 8,
                  backgroundColor: current === idx ? '#475569' : '#cbd5e1'
                }}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Description text */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.9, 0.2, 1] }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl"
          >
            React Native specialist focused on performant apps and polished interactions. Currently full-time and available for selective remote freelance work.
          </motion.p>

          {/* CTA Button with hover effect */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.2, 0.9, 0.2, 1] }}
            className="mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-lg transition-all duration-300 hover:bg-slate-800 dark:hover:bg-white hover:shadow-lg"
              onClick={onContactOpen}
            >
              Let's Work Together
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated blob background */}
      <svg
        className="floating-shape left-8 top-12 w-64 h-64"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute' }}
      >
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
        <motion.path
          fill="url(#g1)"
          d="M43.6,-61.8C57.4,-52.9,71,-40.1,73.4,-25.5C75.8,-10.9,67,-0.5,60.7,12.2C54.5,24.8,50.8,39.6,40.9,48.8C31,58,15,61.6,1.2,60.1C-12.6,58.5,-25.1,51.9,-32.7,41.7C-40.4,31.6,-43.1,17.9,-44.5,4.4C-45.9,-9.1,-46.1,-22.5,-40.6,-33.9C-35,-45.3,-23.8,-54.6,-10.4,-63.1C3,-71.6,16.9,-79.4,30.3,-77.1C43.7,-74.8,57.4,-62.8,43.6,-61.8Z"
          transform="translate(100 100)"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.6, 0.5]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </svg>
    </section>
  )
}