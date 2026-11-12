import React from 'react'
import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import { education } from '../../../data/education'

export default function MonochromeEducation(): React.JSX.Element {
  return (
    <section id="education" className="py-24 bg-zinc-950 text-zinc-100 border-t border-zinc-900 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-semibold">
              Academic Background
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Education
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-sm">
            Degrees and foundational training in Computer Science Engineering.
          </p>
        </div>

        {/* Education Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {education.map((edu, index) => (
            <motion.div
              key={edu.school}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-7 rounded-3xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-zinc-400 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800">
                    {edu.period}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{edu.degree}</h3>
                <p className="text-sm font-semibold text-zinc-300">{edu.school}</p>
              </div>

              {edu.notes && (
                <p className="text-xs text-zinc-400 leading-relaxed pt-2 border-t border-zinc-800/60">
                  {edu.notes}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
