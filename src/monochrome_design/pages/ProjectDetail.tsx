import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Users,
  ExternalLink,
  FolderX,
  Smartphone,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Award,
} from 'lucide-react'
import { FiGithub } from 'react-icons/fi'
import { projects } from '../../../data/projects'
import MonochromeFooter from '../components/Footer'
import ContactModal from '../components/ContactModal'

export default function MonochromeProjectDetail(): React.JSX.Element {
  const { id } = useParams<{ id: string }>()
  const project = projects.find((p) => p.id === id)
  const [contactOpen, setContactOpen] = useState<boolean>(false)

  // Dynamically update document title for SEO
  useEffect(() => {
    if (project) {
      document.title = `${project.title} — Project | Sanyam Mujavadia`
    }
    return () => {
      document.title = 'Sanyam Mujavadia — React Native & Web Developer Portfolio'
    }
  }, [project])

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
        <div className="p-8 sm:p-12 rounded-3xl border border-zinc-800 bg-zinc-900/40 text-center max-w-md w-full space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
            <FolderX size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Project Not Found</h2>
            <p className="text-xs text-zinc-400 mt-1">
              The project you requested could not be located.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-all"
          >
            <ArrowLeft size={14} />
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </div>
    )
  }

  const coverImage = project.coverImage || (project.images && project.images[0])
  const screenshots = project.screenshots || (project.images && project.images.length > 1 ? project.images.slice(1) : [])
  const store = typeof project.demo?.store === 'object' ? project.demo.store : null
  const iosUrl = store?.ios
  const androidUrl = store?.android

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-100 selection:text-zinc-950">
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>All Projects</span>
          </Link>

          <span className="text-xs font-mono text-zinc-500 truncate max-w-[200px] sm:max-w-none">
            Project: {project.title}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-12 sm:py-16 space-y-16">
        {/* Project Header Info */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
              {project.role}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-3xl leading-relaxed">
            {project.description}
          </p>

          {/* Action Links (Stores & GitHub) */}
          <div className="flex flex-wrap gap-3 pt-2">
            {project.demo?.web && (
              <a
                href={project.demo.web}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-md"
              >
                <Globe size={14} />
                <span>Live Demo</span>
              </a>
            )}

            {iosUrl && (
              <a
                href={iosUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-all hover:scale-105 active:scale-95"
              >
                <Smartphone size={14} />
                <span>Apple App Store</span>
              </a>
            )}

            {androidUrl && (
              <a
                href={androidUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-all hover:scale-105 active:scale-95"
              >
                <Smartphone size={14} />
                <span>Google Play</span>
              </a>
            )}

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-all hover:scale-105 active:scale-95"
              >
                <FiGithub size={14} />
                <span>Source Code</span>
              </a>
            )}
          </div>
        </div>

        {/* 16:9 Showcase Cover Image */}
        {coverImage && (
          <div className="rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/30 aspect-[16/9] w-full max-h-[560px] shadow-2xl">
            <img
              src={coverImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Key Impact Stats */}
        {project.impact && project.impact.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {project.impact.map((metric, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-1"
              >
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {metric.value}
                </span>
                <p className="text-xs text-zinc-400">{metric.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Key Features Section */}
        {project.features && project.features.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-zinc-900">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                Architecture & Modules
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">Key Features</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.features.map((feature, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 flex items-start gap-3.5"
                >
                  <CheckCircle2 size={16} className="text-white flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Challenges & Solutions */}
        {project.challenges && project.challenges.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-zinc-900">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                Engineering Decisions
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Challenges & Solutions
              </h2>
            </div>

            <div className="space-y-4">
              {project.challenges.map((item, i) => (
                <div
                  key={i}
                  className="p-6 sm:p-7 rounded-3xl bg-zinc-900/30 border border-zinc-800/80 space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 flex-shrink-0 mt-0.5">
                      Issue #{i + 1}
                    </span>
                    <p className="text-sm font-semibold text-zinc-200 leading-relaxed">
                      {item.problem}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-zinc-800/60 pl-8">
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      <strong className="text-white font-medium">Solution: </strong>
                      {item.solution}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Screenshots Carousel / Gallery */}
        {screenshots && screenshots.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-zinc-900">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                App Interface
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Screenshots ({screenshots.length})
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {screenshots.map((shot, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-[9/16] shadow-lg group"
                >
                  <img
                    src={shot}
                    alt={`${project.title} screenshot ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <MonochromeFooter />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  )
}
