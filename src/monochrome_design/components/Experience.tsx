import React from 'react'
import { motion } from 'framer-motion'
import { Briefcase, ArrowUpRight } from 'lucide-react'
import { experience } from '../../../data/experience'

export default function MonochromeExperience(): React.JSX.Element {
  return (
    <section id="experience" className="py-24 bg-zinc-950 text-zinc-100 border-t border-zinc-900 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-semibold">
              Career Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Work Experience
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-sm">
            Professional track record engineering production mobile solutions.
          </p>
        </div>

        {/* Experience Timeline */}
        <div className="space-y-6">
          {experience.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-7 rounded-3xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white tracking-tight">{exp.role}</h3>
                  <p className="text-sm font-semibold text-zinc-400">{exp.company}</p>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 self-start sm:self-auto">
                  {exp.period}
                </span>
              </div>

              <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
                {exp.impact}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
