import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Smartphone, Globe, Layers } from 'lucide-react'
import { ProjectItem } from '../../types'

interface ProjectCardProps {
  project: ProjectItem
}

export default function MonochromeProjectCard({ project }: ProjectCardProps): React.JSX.Element {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group block rounded-3xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/70 hover:border-zinc-500/80 transition-all duration-300 overflow-hidden flex flex-col h-full shadow-lg shadow-black/40"
    >
      {/* 16:9 Showcase Cover Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950 border-b border-zinc-800/80">
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter grayscale-[25%] group-hover:grayscale-0"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-zinc-700">
            <Layers size={36} />
          </div>
        )}

        {/* Floating Role Pill */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase font-semibold bg-zinc-950/90 text-zinc-300 border border-zinc-800 backdrop-blur-md">
            {project.role}
          </span>
        </div>

        {/* Hover Arrow Badge */}
        <div className="absolute bottom-4 right-4 z-10 w-9 h-9 rounded-full bg-zinc-950/90 border border-zinc-700 flex items-center justify-center text-zinc-300 group-hover:text-black group-hover:bg-white group-hover:border-white transition-all duration-300 shadow-xl">
          <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-zinc-200 transition-colors">
              {project.title}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Tech Stack Tags */}
        <div className="space-y-4 pt-3 border-t border-zinc-800/60">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-zinc-950/80 text-zinc-400 border border-zinc-800/80"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800">
                +{project.tags.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
