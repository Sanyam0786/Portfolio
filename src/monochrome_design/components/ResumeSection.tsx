import React from 'react'
import { motion } from 'framer-motion'
import { Download, ExternalLink, FileText } from 'lucide-react'

const resumePdfPath = '/resume/Sanyam_Mujavadia_Resume.pdf'
const resumePreviewPath = '/resume/resume_preview.png'

export default function MonochromeResumeSection(): React.JSX.Element {
  return (
    <section id="resume" className="py-24 bg-zinc-950 text-zinc-100 border-t border-zinc-900 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-semibold">
              Curriculum Vitae
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Resume
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-sm">
            Complete overview of technical experience, projects, and credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Engineering Summary
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Specialized in React Native cross-platform mobile development with TypeScript, native modules, Reanimated, and real-time backend integrations.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={resumePdfPath}
                download="Sanyam_Mujavadia_Resume.pdf"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-md"
              >
                <Download size={14} />
                <span>Download PDF</span>
              </a>

              <a
                href={resumePdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-all hover:scale-105 active:scale-95"
              >
                <ExternalLink size={14} />
                <span>Open in Tab</span>
              </a>
            </div>
          </div>

          {/* Right Preview Card */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/40 p-3 sm:p-5 shadow-2xl">
              <img
                src={resumePreviewPath}
                alt="Sanyam Mujavadia Resume Preview"
                className="w-full rounded-2xl border border-zinc-800 shadow-md object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
