import React from 'react'
import { education as fallbackEducation } from '../../data/education'
import { motion } from 'framer-motion'
import { EducationItem } from '../types'

interface EducationProps {
  items?: EducationItem[]
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
}

const item = {
  hidden: { y: 14, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.56, ease: [0.2, 0.9, 0.2, 1] } }
}

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.9, 0.2, 1] } }
}

const subtitleVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, delay: 0.2 } }
}

export default function Education({ items }: EducationProps = {}) {
  const displayEducation = items && items.length > 0 ? items : fallbackEducation

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900" aria-label="education" id="education">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={titleVariants}>
          <h3 className="section-title heading-gradient">Education</h3>
        </motion.div>
        <motion.div className="fancy-underline mt-3" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }} style={{ transformOrigin: 'left' }} />
        <motion.p className="section-subtitle" variants={subtitleVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>Academic background and focused coursework.</motion.p>

        <motion.div className="timeline" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={container}>
          {displayEducation.map((ed, idx) => (
            <motion.div key={ed.school} className="timeline-item" variants={item}>
              {/* <div className="timeline-dot" aria-hidden /> */}
              <motion.div className="timeline-card bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-900/50" whileHover={{ y: -6, scale: 1.01 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{ed.degree}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{ed.period}</div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{ed.school}</div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{ed.notes}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}