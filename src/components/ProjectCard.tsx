import React, { useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ProjectItem } from '../types'

export interface ProjectCardProps {
  project: ProjectItem
}

export default function ProjectCard({ project }: ProjectCardProps): React.JSX.Element {
  const cardRef = useRef<HTMLElement | null>(null)

  // Motion values for smooth 3D whole-card tilt
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const smoothX = useSpring(mouseX, { stiffness: 350, damping: 26 })
  const smoothY = useSpring(mouseY, { stiffness: 350, damping: 26 })

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10])
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10])
  const translateX = useTransform(smoothX, [-0.5, 0.5], [-5, 5])
  const translateY = useTransform(smoothY, [-0.5, 0.5], [-5, 5])

  useEffect(() => {
    // Disable on touch devices
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      mouseX.set(0)
      mouseY.set(0)
    }
  }, [mouseX, mouseY])

  function handlePointerMove(e: React.PointerEvent) {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(px)
    mouseY.set(py)
  }

  function handlePointerLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.article
        ref={cardRef}
        layout
        whileHover={{ scale: 1.03 }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          rotateX,
          rotateY,
          x: translateX,
          y: translateY,
          transformStyle: 'preserve-3d',
        }}
        className="rounded-2xl overflow-hidden shadow-lg project-card bg-white dark:bg-slate-800 relative h-full flex flex-col [clip-path:inset(0_round_1rem)] select-none"
        data-cursor
      >
        <div className="card-glow" aria-hidden />
        <Link to={`/projects/${project.id}`} className="block h-full flex flex-col">
          {/* ── Cover: image or gradient with curved top corners ── */}
          <div className="relative h-44 overflow-hidden flex-shrink-0 rounded-t-2xl">
            {project.coverImage ? (
              <>
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-t-2xl transition-transform duration-500"
                />
                {/* Scrim so title text stays readable over any photo */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-t-2xl" />
              </>
            ) : (
              <div className="absolute inset-0 bg-slate-800 rounded-t-2xl border-b border-slate-700/40" />
            )}

            {/* Title — sits on top of both image and gradient */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
              <h3 className="text-lg font-semibold leading-tight">{project.title}</h3>
              <div className="text-sm opacity-90">{project.role}</div>
            </div>
          </div>

          {/* ── Body with description & tech badges ── */}
          <div className="p-4 bg-white dark:bg-slate-800 flex-1 flex flex-col justify-between rounded-b-2xl">
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
              {project.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tags.map((t: string) => (
                <span key={t} className="tech-badge">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ── Original Slide-up Hover overlay with rounded corners ── */}
          <div className="project-overlay rounded-2xl">
            <div className="w-full">
              <div className="flex items-start justify-between w-full">
                <div className="text-white max-w-[70%]">
                  <div className="font-semibold">{project.title}</div>
                  <div className="text-xs opacity-80 mt-1">
                    {project.highlights?.[0] || 'Click to open details'}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className="inline-block px-3 py-1 rounded bg-white/20 text-white text-xs font-medium">View</span>
                <span className="inline-block px-3 py-1 rounded bg-white/10 text-white/80 text-xs font-medium">Details</span>
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    </div>
  )
}