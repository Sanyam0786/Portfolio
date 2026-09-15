import React from 'react'
import { experience } from '../../data/experience'
import { motion } from 'framer-motion'

const container = { show: { transition: { staggerChildren: 0.12 } } }
const item = (dir = 'left') => ({ hidden: { x: dir === 'left' ? -48 : 48, opacity: 0 }, show: { x: 0, opacity: 1, transition: { duration: 0.6, ease: [0.2,0.9,0.2,1] } } })
const titleVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2,0.9,0.2,1] } } }
const subtitleVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.8, delay: 0.2 } } }

export default function Experience(){
  return (
    <section className="py-20" aria-label="experience" id="experience">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={titleVariants}>
          <h3 className="section-title heading-gradient">Experience</h3>
        </motion.div>
        <motion.div className="fancy-underline mt-3" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }} style={{ transformOrigin: 'left' }}/>
        <motion.p className="section-subtitle" variants={subtitleVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>Professional timeline — role, impact, and highlights.</motion.p>

        <motion.div className="timeline" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.12 }} variants={container}>
          {experience.map((e, i) => {
            const dir = i % 2 === 0 ? 'left' : 'right'
            return (
              <motion.div key={e.company} className="timeline-item" variants={item(dir)}>
                {/* <div className="timeline-dot" aria-hidden /> */}
                <motion.div className="timeline-card bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-900/50" whileHover={{ y: -6, scale: 1.01 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold">{e.role}</div>
                      <div className="text-sm opacity-80 dark:text-slate-400">{e.company}</div>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{e.period}</div>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{e.impact}</p>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}