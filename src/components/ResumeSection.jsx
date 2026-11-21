import React from 'react'
import { motion } from 'framer-motion'
import { Download, ExternalLink } from 'lucide-react'

const resumePdfPath = '/resume/Sanyam_Mujavadia_Resume.pdf'
const resumePreviewPath = '/resume/resume_preview.png'

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.9, 0.2, 1] } }
}

export default function ResumeSection() {
  return (
    <section 
      className="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-900/60 relative z-10" 
      aria-label="resume" 
      id="resume"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* 2-Column Content: Aligned at top so Resume heading is beside the top of preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Heading sits directly beside top of the resume preview */}
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05 }}
            variants={itemVariants}
            className="lg:col-span-5 flex flex-col justify-start"
          >
            {/* Section Heading aligned beside top of preview */}
            <div className="mb-6">
              <h3 className="section-title heading-gradient">Resume</h3>
              <motion.div 
                className="fancy-underline mt-2" 
                initial={{ scaleX: 0 }} 
                whileInView={{ scaleX: 1 }} 
                transition={{ duration: 0.6, delay: 0.2 }} 
                viewport={{ once: true }} 
                style={{ transformOrigin: 'left' }} 
              />
            </div>

            {/* Statement headline matching portfolio typography */}
            <h4 className="text-xl sm:text-2xl font-semibold leading-relaxed tracking-normal text-slate-800 dark:text-slate-100">
              I am a React & React Native developer who ships polished mobile apps and scalable web applications — and cares as much about how they feel as how they work.
            </h4>

            {/* Info Table / List with subtle dividers */}
            <div className="mt-7 border-t border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              <div className="py-3.5 flex items-center justify-between gap-4">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Role</span>
                <span className="text-slate-900 dark:text-slate-100 font-medium text-right">Mobile & Web Developer</span>
              </div>
              <div className="py-3.5 flex items-center justify-between gap-4">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Education</span>
                <span className="text-slate-900 dark:text-slate-100 font-medium text-right">B.Tech Computer Science, Silver Oak University</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex flex-wrap items-center gap-3 mt-7">
              <motion.a
                href={resumePdfPath}
                download="Sanyam_Mujavadia_Resume.pdf"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-all shadow-sm"
                id="download-resume-btn"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Right Column: PDF Display Preview (Aligned at top with left column) */}
          <div className="lg:col-span-7 w-full">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800/90 shadow-xl overflow-hidden flex flex-col w-full"
            >
              {/* Window Top Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200/80 dark:border-slate-700/80 bg-slate-100/70 dark:bg-slate-800/90">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block"></span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300 ml-1.5 truncate max-w-[200px] sm:max-w-none">
                    Sanyam_Mujavadia_Resume.pdf
                  </span>
                </div>
                <a
                  href={resumePdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200/70 dark:bg-slate-700/70 hover:bg-slate-300/70 dark:hover:bg-slate-600 transition-colors"
                  title="Open resume in new tab"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Document Preview */}
              <a
                href={resumePdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white overflow-hidden cursor-pointer"
              >
                <img
                  src={resumePreviewPath}
                  alt="Sanyam Mujavadia Resume"
                  className="w-full h-auto block select-none"
                  loading="eager"
                />
              </a>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
