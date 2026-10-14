import React, { useState, useEffect } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Cpu,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { createPortal } from 'react-dom'
import { SkillItem } from '../../types'
import ImageUploader, { StagedFile } from '../components/ImageUploader'

interface SkillRecord extends SkillItem {
  id?: string
  display_order?: number
}

const LEVEL_OPTIONS = ['Expert', 'Advanced', 'Intermediate', 'Familiar']

export default function ManageSkills(): React.JSX.Element {
  const [skills, setSkills] = useState<SkillRecord[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [editingSkill, setEditingSkill] = useState<SkillRecord | null>(null)
  const [stagedIcon, setStagedIcon] = useState<StagedFile | null>(null)

  const fetchSkills = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      if (data) setSkills(data)
    } catch (err: any) {
      console.error('Error fetching skills:', err)
      showToast('error', err.message || 'Failed to load skills')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
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
    setEditingSkill({
      name: '',
      icon: '',
      level: 'Expert',
      display_order: skills.length,
    })
    setStagedIcon(null)
    setIsModalOpen(true)
  }

  const openEditModal = (skill: SkillRecord) => {
    setEditingSkill({ ...skill })
    setStagedIcon(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (name: string) => {
    if (!window.confirm(`Delete skill "${name}"?`)) return

    try {
      const { error } = await supabase.from('skills').delete().eq('name', name)
      if (error) throw error

      showToast('success', `Deleted skill "${name}"`)
      setSkills((prev) => prev.filter((s) => s.name !== name))
    } catch (err: any) {
      console.error('Error deleting skill:', err)
      showToast('error', err.message || 'Failed to delete skill')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSkill?.name) {
      showToast('error', 'Skill name is required')
      return
    }

    setIsSaving(true)
    try {
      let finalIcon = editingSkill.icon || ''
      if (stagedIcon) {
        const sanitized = editingSkill.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')
        const iconPath = `skills/${sanitized || 'skill'}.webp`
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('portfolio-media')
          .upload(iconPath, stagedIcon.blob, {
            contentType: stagedIcon.contentType,
            cacheControl: '31536000',
            upsert: true,
          })
        if (uploadErr) throw uploadErr

        const { data: pubData } = supabase.storage
          .from('portfolio-media')
          .getPublicUrl(uploadData.path)
        finalIcon = pubData.publicUrl
      }

      const payload = {
        name: editingSkill.name.trim(),
        icon: finalIcon,
        level: editingSkill.level || 'Expert',
        display_order: editingSkill.display_order ?? skills.length,
      }

      const { error } = await supabase.from('skills').upsert(payload, { onConflict: 'name' })
      if (error) throw error

      showToast('success', `Skill "${payload.name}" saved`)
      setIsModalOpen(false)
      await fetchSkills()
    } catch (err: any) {
      console.error('Error saving skill:', err)
      showToast('error', err.message || 'Failed to save skill')
    } finally {
      setIsSaving(false)
    }
  }

  const filteredSkills = skills.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="section-title heading-gradient">Skills & Stack</h2>
          <div className="fancy-underline mt-2" />
          <p className="section-subtitle mt-2">Manage technical stack proficiencies, icons, and categories.</p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold bg-slate-100 text-slate-900 hover:bg-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>Add Skill</span>
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

      {/* Search Bar */}
      <div className="flex items-center gap-3 darkGlass border border-slate-700/80 rounded-2xl px-4 py-2.5 max-w-md">
        <Search size={15} className="text-slate-400" />
        <input
          type="text"
          placeholder="Filter skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none text-xs text-white placeholder-slate-400 w-full focus:outline-none"
        />
      </div>

      {/* Skills Grid matching website skill cards */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 size={24} className="animate-spin text-slate-400" />
          <p className="text-xs text-slate-400">Loading skills...</p>
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="p-10 text-center rounded-2xl darkGlass border border-slate-700/70">
          <Cpu size={28} className="mx-auto text-slate-400 mb-2" />
          <p className="text-sm font-semibold text-slate-200">No skills found</p>
          <p className="text-xs text-slate-400 mt-1">Click "Add Skill" to add an item.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              className="darkGlass p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:border-slate-600 transition-all shadow-sm hover:shadow-lg group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center p-2 flex-shrink-0">
                  {skill.icon ? (
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="w-full h-full object-contain brightness-0 invert"
                    />
                  ) : (
                    <Cpu size={16} className="text-white" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{skill.name}</p>
                  <span className="text-[10px] font-medium text-slate-400">{skill.level}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(skill)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Edit"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => handleDelete(skill.name)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/20"
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && editingSkill && typeof document !== 'undefined' && createPortal(
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="darkGlass border border-slate-700/80 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4 bg-slate-900/95"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingSkill.name ? `Edit: ${editingSkill.name}` : 'Add New Skill'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TypeScript"
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-slate-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Proficiency Level</label>
                <select
                  value={editingSkill.level}
                  onChange={(e) => setEditingSkill((prev) => (prev ? { ...prev, level: e.target.value } : null))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-slate-500/40"
                >
                  {LEVEL_OPTIONS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <ImageUploader
                label="Skill Icon (Upload PNG / SVG)"
                folder="skills"
                fileName={`${editingSkill.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '_') || 'skill'}.webp`}
                value={editingSkill.icon}
                onFileSelect={(staged) => setStagedIcon(staged)}
                onChange={(url) => {
                  setEditingSkill((prev) => (prev ? { ...prev, icon: url } : null))
                  if (!url) setStagedIcon(null)
                }}
                invertPreview={true}
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-900 hover:bg-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {isSaving && <Loader2 size={13} className="animate-spin" />}
                  <span>{isSaving ? 'Saving...' : 'Save Skill'}</span>
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
