import React from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Mail, Phone, FileText } from 'lucide-react'
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa'
import { contact } from '../../../data/contact'

interface HeroProps {
  onContactOpen: () => void
}

export default function MonochromeHero({ onContactOpen }: HeroProps): React.JSX.Element {
  return (
    <section id="hero" className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Subtle architectural grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-12">
        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono text-zinc-300"
        >
          <span>Available for Freelance & Full-Time Mobile Roles</span>
        </motion.div>

        {/* Headline & Subtitle */}
        <div className="space-y-6 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08]"
          >
            Crafting High-Performance{' '}
            <span className="text-zinc-400 font-serif italic font-normal">
              Mobile Experiences
            </span>{' '}
            with React Native.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed"
          >
            Hi, I'm <strong className="text-zinc-100 font-semibold">{contact.name}</strong>. A React Native & Web developer based in India, delivering polished iOS, Android, and web products with clean architecture and pixel-perfect execution.
          </motion.p>
        </div>

        {/* Action Buttons & Socials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center gap-4 pt-2"
        >
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
              window.history.pushState(null, '', '#projects')
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/5 cursor-pointer"
          >
            <span>View Projects</span>
            <ArrowDown size={14} />
          </a>

          <button
            onClick={onContactOpen}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-all hover:scale-105 active:scale-95"
          >
            <Mail size={14} />
            <span>Contact Me</span>
          </button>

          <div className="h-6 w-px bg-zinc-800 hidden sm:block mx-1" />

          {/* Social Links */}
          <div className="flex items-center gap-2">
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="GitHub Profile"
            >
              <FaGithub size={15} />
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="LinkedIn Profile"
            >
              <FaLinkedinIn size={15} />
            </a>
            <a
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="WhatsApp Chat"
            >
              <FaWhatsapp size={15} />
            </a>
          </div>
        </motion.div>

        {/* Minimal Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-zinc-800/80"
        >
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">10+</span>
            <p className="text-xs text-zinc-400 mt-1">Production Projects</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">100%</span>
            <p className="text-xs text-zinc-400 mt-1">App Store Delivery</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">2+</span>
            <p className="text-xs text-zinc-400 mt-1">Years Experience</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">iOS & Android</span>
            <p className="text-xs text-zinc-400 mt-1">Cross-Platform</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
