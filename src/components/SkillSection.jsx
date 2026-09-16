import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { skills } from '../../data/skills'

const SkillsSection = () => {
  const [isPaused, setIsPaused] = useState(false)
  const scrollContainerRef = useRef(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  // Duplicate skills for infinite scroll effect
  const displaySkills = [...skills, ...skills]

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollContainerRef.current && !isPaused) {
        const container = scrollContainerRef.current

        setScrollPosition((prev) => {
          const halfWidth = container.scrollWidth / 2
          let newPosition = prev + 1.2

          if (newPosition >= halfWidth) {
            newPosition = newPosition - halfWidth
          }

          return newPosition
        })
      }
    }, 20)

    return () => clearInterval(interval)
  }, [isPaused])

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.transform = `translateX(-${scrollPosition}px)`
    }
  }, [scrollPosition])

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
    <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300" aria-label="skills" id="skills">
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
            <div className="fancy-underline mb-4" />
            <p className="section-subtitle">Technologies and tools I work with</p>
          </motion.div>

          {/* Skills Carousel */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden"
          >
            {/* Gradient overlays for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 will-change-transform pt-6 pb-2"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              {displaySkills.map((skill, idx) => (
                <motion.div
                  key={`${skill.name}-${idx}`}
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="flex-shrink-0"
                >
                  <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg dark:hover:shadow-slate-950/40 transition-all duration-300 min-w-[180px] sm:min-w-[200px] h-full flex flex-col items-center justify-center gap-3 group cursor-pointer">
                    {/* Icon */}
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        className="w-12 h-12 object-contain"
                        loading="lazy"
                      />
                    </div>

                    {/* Skill Name */}
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-center text-sm">
                      {skill.name}
                    </h3>

                    {/* Level Badge */}
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${skill.level === 'Expert'
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                      {skill.level}
                    </span>

                    {/* Animated underline on hover */}
                    <div className="w-6 h-0.5 bg-indigo-500 dark:bg-indigo-400 rounded-full group-hover:w-10 transition-all duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default SkillsSection