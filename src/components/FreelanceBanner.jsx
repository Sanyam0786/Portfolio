import React from 'react'
import { motion } from 'framer-motion'

export default function FreelanceBanner(){
  return (
    <motion.section
      initial={{ scale: 0.98, opacity: 0.9 }}
      whileInView={{ scale:1, opacity:1 }}
      className="my-12 py-6 px-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white w-full max-w-4xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-semibold text-lg">Available for select freelance work</div>
          <div className="text-sm opacity-80">Full-time developer; open to short-term remote projects that fit my focus.</div>
        </div>
        <div>
          <a href="mailto:youremail@example.com" className="inline-block px-4 py-2 bg-white text-slate-900 rounded-md font-medium">Contact</a>
        </div>
      </div>
    </motion.section>
  )
}
