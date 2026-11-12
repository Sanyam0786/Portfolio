import React from 'react'
import { motion } from 'framer-motion'
import { skills } from '../../../data/skills'
import { Cpu } from 'lucide-react'

export default function MonochromeSkillsSection(): React.JSX.Element {
  return (
    <section id="skills" className="py-24 bg-zinc-950 text-zinc-100 border-t border-zinc-900 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-semibold">
              Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Technical Stack
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-sm">
            Core technologies and mobile tooling used to architect and ship production apps.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.03 }}
              className="p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-500 hover:bg-zinc-900 transition-all group flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center p-1.5 flex-shrink-0 group-hover:border-zinc-700 transition-colors">
                {skill.icon ? (
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    className="w-full h-full object-contain filter grayscale invert opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <Cpu size={14} className="text-zinc-400" />
                )}
              </div>

              <div className="min-w-0">
                <span className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors block truncate">
                  {skill.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {skill.level}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
