import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function ProjectCard({ project }) {
  const [innerStyle, setInnerStyle] = useState({})
  const cardRef = useRef(null)
  const innerRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      setInnerStyle({})
    }
  }, [])

  function handlePointerMove(e) {
    const el = innerRef.current || cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rx = (px - 0.5) * 8
    const ry = (py - 0.5) * 8
    const tx = (px - 0.5) * 6
    const ty = (py - 0.5) * 6
    setInnerStyle({ transform: `perspective(900px) translate3d(${tx}px, ${ty}px, 0) rotateX(${-ry}deg) rotateY(${rx}deg)` })
  }

  function handlePointerLeave() {
    setInnerStyle({ transform: 'perspective(900px) translate3d(0,0,0) rotateX(0) rotateY(0)' })
  }

  return (
    <motion.article
      ref={cardRef}
      layout
      whileHover={{ y: -8, scale: 1.03 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="rounded-2xl overflow-hidden shadow-lg project-card bg-white dark:bg-slate-800"
      data-cursor
    >
      <div className="card-glow" aria-hidden />
      <Link to={`/projects/${project.id}`} className="block">

        {/* ── Cover: image or gradient ── */}
        <div className="relative h-44 overflow-hidden">
          {project.coverImage ? (
            <>
              <img
                src={project.coverImage}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
              />
              {/* Scrim so title text stays readable over any photo */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </>
          ) : (
            <div className={`absolute inset-0 ${project.coverColor}`} />
          )}

          {/* Title — sits on top of both image and gradient */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-lg font-semibold leading-tight">{project.title}</h3>
            <div className="text-sm opacity-90">{project.role}</div>
          </div>
        </div>

        {/* ── Body with parallax tilt ── */}
        <div ref={innerRef} style={innerStyle} className="p-4 bg-white dark:bg-slate-800 parallax-inner">
          <p className="text-sm text-slate-600 dark:text-slate-300">{project.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span key={t} className="tech-badge">{t}</span>
            ))}
          </div>
        </div>

        {/* ── Hover overlay (unchanged) ── */}
        <div className="project-overlay">
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
              <span className="inline-block px-3 py-1 rounded bg-white/20 text-white text-xs">View</span>
              <span className="inline-block px-3 py-1 rounded bg-white/10 text-white/80 text-xs">Share</span>
            </div>
          </div>
        </div>

      </Link>
    </motion.article>
  )
}