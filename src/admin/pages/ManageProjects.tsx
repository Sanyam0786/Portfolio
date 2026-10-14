import React, { useState, useEffect } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  FolderKanban,
  ImageIcon,
  Sparkles,
  Smartphone,
  Globe,
  Award,
  AlertTriangle,
  Check,
} from 'lucide-react'
import { FiGithub } from 'react-icons/fi'
import { supabase } from '../../lib/supabase'
import { createPortal } from 'react-dom'
import { ProjectItem, ProjectChallenge, ProjectImpact } from '../../types'
import ImageUploader, { StagedFile } from '../components/ImageUploader'

export default function ManageProjects(): React.JSX.Element {
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Current editing state
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null)
  const [tagsInput, setTagsInput] = useState<string>('')
  const [highlightsInput, setHighlightsInput] = useState<string>('')
  const [featuresInput, setFeaturesInput] = useState<string>('')
  const [screenshotInput, setScreenshotInput] = useState<string>('')

  // Staged files: kept locally in WebP in memory, only uploaded when clicking "Save Changes"
  const [stagedCover, setStagedCover] = useState<StagedFile | null>(null)
  const [stagedScreenshots, setStagedScreenshots] = useState<Map<string, StagedFile>>(new Map())

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error

      if (data) {
        setProjects(
          data.map((p) => ({
            id: p.id,
            title: p.title,
            role: p.role,
            description: p.description,
            tags: p.tags || [],
            coverImage: p.cover_image || '',
            screenshots: p.screenshots || [],
            demo: p.demo || {},
            highlights: p.highlights || [],
            features: p.features || [],
            challenges: p.challenges || [],
            impact: p.impact || [],
            github: p.github || '',
          }))
        )
      }
    } catch (err: any) {
      console.error('Error fetching projects:', err)
      showToast('error', err.message || 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (isModalOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [isModalOpen])

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text })
    setTimeout(() => setToast(null), 3500)
  }

  const openAddModal = () => {
    setEditingProject({
      id: '',
      title: '',
      role: '',
      description: '',
      tags: [],
      coverImage: '',
      screenshots: [],
      demo: { web: '', store: { ios: '', android: '' }, available: true },
      highlights: [],
      features: [],
      challenges: [{ problem: '', solution: '' }],
      impact: [{ value: '', label: '' }],
      github: '',
    })
    setTagsInput('')
    setHighlightsInput('')
    setFeaturesInput('')
    setScreenshotInput('')
    setStagedCover(null)
    setStagedScreenshots(new Map())
    setIsModalOpen(true)
  }

  const openEditModal = (project: ProjectItem) => {
    setEditingProject({
      ...project,
      demo: {
        web: project.demo?.web || '',
        available: project.demo?.available ?? true,
        store: {
          ios: typeof project.demo?.store === 'object' ? project.demo.store.ios || '' : '',
          android: typeof project.demo?.store === 'object' ? project.demo.store.android || '' : '',
        },
      },
      challenges:
        project.challenges && project.challenges.length > 0
          ? project.challenges
          : [{ problem: '', solution: '' }],
      impact:
        project.impact && project.impact.length > 0
          ? project.impact
          : [{ value: '', label: '' }],
    })
    setTagsInput(project.tags.join(', '))
    setHighlightsInput((project.highlights || []).join('\n'))
    setFeaturesInput((project.features || []).join('\n'))
    setScreenshotInput('')
    setStagedCover(null)
    setStagedScreenshots(new Map())
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete project "${title}"?`)) return

    try {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) throw error

      showToast('success', `Deleted "${title}"`)
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch (err: any) {
      console.error('Error deleting project:', err)
      showToast('error', err.message || 'Failed to delete project')
    }
  }

  // --- Dynamic array handlers ---
  const handleStoreChange = (platform: 'ios' | 'android', url: string) => {
    setEditingProject((prev) => {
      if (!prev) return null
      const currentStore = typeof prev.demo?.store === 'object' ? prev.demo.store : {}
      return {
        ...prev,
        demo: {
          ...(prev.demo || {}),
          store: {
            ...currentStore,
            [platform]: url,
          },
        },
      }
    })
  }

  const handleAddScreenshotUrl = () => {
    const trimmed = screenshotInput.trim()
    if (!trimmed) return
    setEditingProject((prev) => ({
      ...prev,
      screenshots: [...(prev?.screenshots || []), trimmed],
    }))
    setScreenshotInput('')
  }

  const handleRemoveScreenshot = (index: number) => {
    setEditingProject((prev) => {
      const removedUrl = prev?.screenshots?.[index]
      if (removedUrl) {
        setStagedScreenshots((currentMap) => {
          const next = new Map(currentMap)
          next.delete(removedUrl)
          return next
        })
      }
      return {
        ...prev,
        screenshots: (prev?.screenshots || []).filter((_, i) => i !== index),
      }
    })
  }

  const handleAddChallenge = () => {
    setEditingProject((prev) => ({
      ...prev,
      challenges: [...(prev?.challenges || []), { problem: '', solution: '' }],
    }))
  }

  const handleChallengeChange = (index: number, field: 'problem' | 'solution', val: string) => {
    setEditingProject((prev) => {
      if (!prev) return null
      const updated = [...(prev.challenges || [])]
      updated[index] = { ...updated[index], [field]: val }
      return { ...prev, challenges: updated }
    })
  }

  const handleRemoveChallenge = (index: number) => {
    setEditingProject((prev) => ({
      ...prev,
      challenges: (prev?.challenges || []).filter((_, i) => i !== index),
    }))
  }

  const handleAddImpact = () => {
    setEditingProject((prev) => ({
      ...prev,
      impact: [...(prev?.impact || []), { value: '', label: '' }],
    }))
  }

  const handleImpactChange = (index: number, field: 'value' | 'label', val: string) => {
    setEditingProject((prev) => {
      if (!prev) return null
      const updated = [...(prev.impact || [])]
      updated[index] = { ...updated[index], [field]: val }
      return { ...prev, impact: updated }
    })
  }

  const handleRemoveImpact = (index: number) => {
    setEditingProject((prev) => ({
      ...prev,
      impact: (prev?.impact || []).filter((_, i) => i !== index),
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject?.id || !editingProject?.title) {
      showToast('error', 'Project ID and Title are required')
      return
    }

    setIsSaving(true)
    try {
      const projectSlug = editingProject.id.trim().toLowerCase().replace(/\s+/g, '-')
      const projectFolder = `projects/${projectSlug}`

      // 1. Upload staged cover if a new file was selected
      let finalCoverImage = editingProject.coverImage || ''
      if (stagedCover) {
        const coverPath = `${projectFolder}/${stagedCover.fileName}`
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('portfolio-media')
          .upload(coverPath, stagedCover.blob, {
            contentType: stagedCover.contentType,
            cacheControl: '31536000',
            upsert: true,
          })
        if (uploadErr) throw uploadErr

        const { data: pubData } = supabase.storage
          .from('portfolio-media')
          .getPublicUrl(uploadData.path)
        finalCoverImage = pubData.publicUrl
      }

      // 2. Upload any staged screenshots
      const finalScreenshots: string[] = []
      const currentScreenshots = editingProject.screenshots || []

      for (let i = 0; i < currentScreenshots.length; i++) {
        const shot = currentScreenshots[i]
        const staged = stagedScreenshots.get(shot)

        if (staged) {
          const shotPath = `${projectFolder}/${staged.fileName}`
          const { data: uploadData, error: uploadErr } = await supabase.storage
            .from('portfolio-media')
            .upload(shotPath, staged.blob, {
              contentType: staged.contentType,
              cacheControl: '31536000',
              upsert: true,
            })
          if (uploadErr) throw uploadErr

          const { data: pubData } = supabase.storage
            .from('portfolio-media')
            .getPublicUrl(uploadData.path)
          finalScreenshots.push(pubData.publicUrl)
        } else {
          // Already an existing remote URL or external link
          finalScreenshots.push(shot)
        }
      }

      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const parsedHighlights = highlightsInput
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean)

      const parsedFeatures = featuresInput
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean)

      // Clean challenges and impact from empty entries
      const cleanedChallenges = (editingProject.challenges || []).filter(
        (c) => c.problem.trim() || c.solution.trim()
      )
      const cleanedImpact = (editingProject.impact || []).filter(
        (i) => i.value.trim() || i.label.trim()
      )

      const payload = {
        id: projectSlug,
        title: editingProject.title.trim(),
        role: editingProject.role || '',
        description: editingProject.description || '',
        tags: parsedTags,
        cover_image: finalCoverImage,
        screenshots: finalScreenshots,
        demo: editingProject.demo || {},
        highlights: parsedHighlights,
        features: parsedFeatures,
        challenges: cleanedChallenges,
        impact: cleanedImpact,
        github: editingProject.github || '',
        is_published: true,
      }

      const { error } = await supabase.from('projects').upsert(payload, { onConflict: 'id' })
      if (error) throw error

      showToast('success', `Project "${payload.title}" saved successfully`)
      setIsModalOpen(false)
      await fetchProjects()
    } catch (err: any) {
      console.error('Error saving project:', err)
      showToast('error', err.message || 'Failed to save project')
    } finally {
      setIsSaving(false)
    }
  }

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const storeObj = typeof editingProject?.demo?.store === 'object' ? editingProject.demo.store : {}

  return (
    <div className="space-y-6">
      {/* Section Header matching Website typography */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="section-title heading-gradient">Projects</h2>
          <div className="fancy-underline mt-2" />
          <p className="section-subtitle mt-2">
            Manage portfolio showcase projects, case study copy, screenshots, and store links.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold bg-slate-100 text-slate-900 hover:bg-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>New Project</span>
        </button>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 darkGlass border ${
            toast.type === 'success'
              ? 'border-emerald-500/30 text-emerald-300'
              : 'border-red-500/30 text-red-300'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Search Bar matching website style */}
      <div className="flex items-center gap-3 darkGlass border border-slate-700/80 rounded-2xl px-4 py-2.5 max-w-md">
        <Search size={15} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search by title, role or technology..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none text-xs text-white placeholder-slate-400 w-full focus:outline-none"
        />
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 size={24} className="animate-spin text-slate-400" />
          <p className="text-xs text-slate-400">Loading projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-10 text-center rounded-2xl darkGlass border border-slate-700/70">
          <FolderKanban size={28} className="mx-auto text-slate-400 mb-2" />
          <p className="text-sm font-semibold text-slate-200">No projects found</p>
          <p className="text-xs text-slate-400 mt-1">Click "New Project" to create your first case study.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="darkGlass rounded-2xl border border-white/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-600 transition-all shadow-sm hover:shadow-lg group"
            >
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {project.coverImage ? (
                    <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <ImageIcon size={18} className="text-white/80" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white">{project.title}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                      /{project.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">{project.role}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tags.slice(0, 5).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-semibold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/60"
                      >
                        {t}
                      </span>
                    ))}
                    {project.screenshots && project.screenshots.length > 0 && (
                      <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                        {project.screenshots.length} shots
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                <a
                  href={`/project/${project.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="View Public Page"
                >
                  <ExternalLink size={15} />
                </a>

                <button
                  onClick={() => openEditModal(project)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Edit Project"
                >
                  <Pencil size={15} />
                </button>

                <button
                  onClick={() => handleDelete(project.id, project.title)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
                  title="Delete Project"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comprehensive Add/Edit Project Modal in ONE single scrollable form with dark inputs */}
      {isModalOpen && editingProject && typeof document !== 'undefined' && createPortal(
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto scrollbar-thin"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="darkGlass border border-slate-700/80 rounded-3xl max-w-3xl w-full p-5 sm:p-7 max-h-[92vh] flex flex-col shadow-2xl bg-slate-900/95"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200">
                  <FolderKanban size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingProject.id ? `Edit: ${editingProject.title || editingProject.id}` : 'Create New Project'}
                  </h3>
                  <p className="text-xs text-slate-400">Configure complete case study data for the project detail page</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body Form: Single continuous scrollable view */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto scrollbar-thin py-5 space-y-7 pr-2">
              {/* SECTION 1: General Info */}
              <div className="space-y-4">
                <div className="flex items-center pb-2 border-b border-slate-800/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    1. General Information
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Slug ID * <span className="text-slate-500 font-normal">(/project/:id)</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="kyora-iq"
                      value={editingProject.id || ''}
                      onChange={(e) =>
                        setEditingProject((prev) => ({
                          ...prev,
                          id: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="Kyora IQ"
                      value={editingProject.title || ''}
                      onChange={(e) => setEditingProject((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role / Subtitle</label>
                  <input
                    type="text"
                    placeholder="e.g. Lead React Native Developer"
                    value={editingProject.role || ''}
                    onChange={(e) => setEditingProject((prev) => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Project Description</label>
                  <textarea
                    rows={3}
                    placeholder="Comprehensive summary of what the project solves and does..."
                    value={editingProject.description || ''}
                    onChange={(e) => setEditingProject((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 transition-all leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tags <span className="text-slate-500 font-normal">(comma-separated technologies)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="React Native, TypeScript, Firebase, Tailwind CSS"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 transition-all"
                  />
                </div>
              </div>

              {/* SECTION 2: External Links & Store */}
              <div className="space-y-4 pt-3 border-t border-slate-800/80">
                <div className="flex items-center pb-2 border-b border-slate-800/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    2. External Links & App Stores
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Smartphone size={13} className="text-slate-400" />
                      <span>Google Play Store (Android URL)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://play.google.com/store/apps/details?id=..."
                      value={storeObj?.android || ''}
                      onChange={(e) => handleStoreChange('android', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Smartphone size={13} className="text-slate-400" />
                      <span>Apple App Store (iOS URL)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://apps.apple.com/app/..."
                      value={storeObj?.ios || ''}
                      onChange={(e) => handleStoreChange('ios', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Globe size={13} className="text-slate-400" />
                      <span>Live Web Demo URL</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://kyora.app"
                      value={editingProject.demo?.web || ''}
                      onChange={(e) =>
                        setEditingProject((prev) => ({
                          ...prev,
                          demo: { ...(prev?.demo || {}), web: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                      <FiGithub size={13} className="text-slate-400" />
                      <span>GitHub Repository</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={editingProject.github || ''}
                      onChange={(e) => setEditingProject((prev) => ({ ...prev, github: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Media & Appearance */}
              <div className="space-y-4 pt-3 border-t border-slate-800/80">
                <div className="flex items-center pb-2 border-b border-slate-800/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    3. Cover & Screenshots
                  </h4>
                </div>

                {/* Cover Image */}
                <ImageUploader
                  label="Cover Image (Hero Showcase Banner)"
                  folder={`projects/${(editingProject.id || editingProject.title || 'new-project').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/^-+|-+$/g, '') || 'new-project'}`}
                  fileName="cover.webp"
                  value={editingProject.coverImage}
                  aspectRatio="16/9"
                  standardizeAspectRatio={16 / 9}
                  recommendedDimensions={{
                    width: 1920,
                    height: 1080,
                    label: '1920 × 1080 px (16:9 Ratio)',
                  }}
                  onFileSelect={(staged) => setStagedCover(staged)}
                  onChange={(url) => {
                    setEditingProject((prev) => ({ ...prev, coverImage: url }))
                    if (!url) setStagedCover(null)
                  }}
                />

                {/* Screenshots Gallery */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300">
                        Screenshots Gallery ({editingProject.screenshots?.length || 0})
                      </label>
                      <p className="text-[11px] text-slate-400">
                        Screenshots displayed in the mobile carousel on the detail page
                      </p>
                    </div>
                  </div>

                  {/* Paste URL */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      placeholder="Paste image URL (https://...)"
                      value={screenshotInput}
                      onChange={(e) => setScreenshotInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddScreenshotUrl()
                        }
                      }}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-700/80 bg-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleAddScreenshotUrl}
                      disabled={!screenshotInput.trim()}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 disabled:opacity-50 transition-all"
                    >
                      Add URL
                    </button>
                  </div>

                  {/* Upload File */}
                  <ImageUploader
                    label="Or Upload Screenshot File directly to Storage"
                    folder={`projects/${(editingProject.id || editingProject.title || 'new-project').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/^-+|-+$/g, '') || 'new-project'}`}
                    onFileSelect={(staged) => {
                      setStagedScreenshots((prev) => {
                        const next = new Map(prev)
                        next.set(staged.previewUrl, staged)
                        return next
                      })
                    }}
                    onChange={(url) => {
                      if (url) {
                        setEditingProject((prev) => ({
                          ...prev,
                          screenshots: [...(prev?.screenshots || []), url],
                        }))
                      }
                    }}
                  />

                  {/* Screenshots preview grid */}
                  {editingProject.screenshots && editingProject.screenshots.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {editingProject.screenshots.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative group rounded-xl overflow-hidden border border-slate-700/80 bg-slate-800 aspect-[9/16] max-h-48 flex items-center justify-center"
                        >
                          <img src={url} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                            <span className="text-[10px] font-mono text-white/80 absolute top-2 left-2">
                              #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveScreenshot(idx)}
                              className="p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors"
                              title="Remove screenshot"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 4: Highlights & Features */}
              <div className="space-y-4 pt-3 border-t border-slate-800/80">
                <div className="flex items-center pb-2 border-b border-slate-800/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    4. Highlights & Features
                  </h4>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Key Highlights <span className="text-slate-500 font-normal">(one bullet per line)</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Designed and built production UI from scratch&#10;Integrated Google Maps with live tracking&#10;Reduced app bundle size by 35%"
                    value={highlightsInput}
                    onChange={(e) => setHighlightsInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 transition-all font-mono leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Features Breakdown <span className="text-slate-500 font-normal">(one feature per line)</span>
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Live GPS tracking with animated marker movement&#10;Stripe payments, TanStack Query, and Redux Toolkit integration&#10;Real-time chat with Socket.io"
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 transition-all font-mono leading-relaxed"
                  />
                </div>
              </div>

              {/* SECTION 5: Challenges & Solutions */}
              <div className="space-y-4 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    5. Challenges & Solutions
                  </h4>

                  <button
                    type="button"
                    onClick={handleAddChallenge}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-all"
                  >
                    <Plus size={13} />
                    <span>Add Challenge</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(editingProject.challenges || []).map((ch, idx) => (
                    <div
                      key={idx}
                      className="darkGlass border border-slate-700/70 rounded-2xl p-4 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-xs font-semibold text-indigo-400">Challenge #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveChallenge(idx)}
                          className="text-slate-400 hover:text-red-400 p-1 rounded-lg transition-colors"
                          title="Remove Challenge"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Problem / Obstacle
                        </label>
                        <textarea
                          rows={2}
                          placeholder="What technical obstacle or scaling challenge did you face?"
                          value={ch.problem}
                          onChange={(e) => handleChallengeChange(idx, 'problem', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-700/80 bg-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Solution / Architecture
                        </label>
                        <textarea
                          rows={2}
                          placeholder="How did you solve it? (e.g. event-driven architecture, custom caching)"
                          value={ch.solution}
                          onChange={(e) => handleChallengeChange(idx, 'solution', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-700/80 bg-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 6: Impact Metrics */}
              <div className="space-y-4 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    6. Impact & Metric Badges
                  </h4>

                  <button
                    type="button"
                    onClick={handleAddImpact}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-all"
                  >
                    <Plus size={13} />
                    <span>Add Metric</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(editingProject.impact || []).map((imp, idx) => (
                    <div
                      key={idx}
                      className="darkGlass border border-slate-700/70 rounded-2xl p-4 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-[11px] font-semibold text-emerald-400">Metric #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImpact(idx)}
                          className="text-slate-400 hover:text-red-400 p-1 rounded-lg transition-colors"
                          title="Remove Metric"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Value <span className="text-slate-500 font-normal">(e.g. "Live", "10k+", "2 Apps")</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Live"
                          value={imp.value}
                          onChange={(e) => handleImpactChange(idx, 'value', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-700/80 bg-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Label <span className="text-slate-500 font-normal">(e.g. "GPS Tracking", "Active Users")</span>
                        </label>
                        <input
                          type="text"
                          placeholder="GPS Tracking"
                          value={imp.label}
                          onChange={(e) => handleImpactChange(idx, 'label', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-700/80 bg-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-end gap-2.5 pt-5 border-t border-slate-800/80 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-900 hover:bg-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {isSaving && <Loader2 size={13} className="animate-spin" />}
                  <span>{isSaving ? 'Saving Project...' : 'Save Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
