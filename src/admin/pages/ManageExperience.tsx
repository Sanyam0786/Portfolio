import React, { useState, useEffect } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Briefcase,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { createPortal } from 'react-dom'
import { ExperienceItem } from '../../types'

interface ExperienceRecord extends ExperienceItem {
  id?: string
  display_order?: number
}

export default function ManageExperience(): React.JSX.Element {
  const [items, setItems] = useState<ExperienceRecord[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [editingItem, setEditingItem] = useState<ExperienceRecord | null>(null)

  const fetchExperience = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      if (data) setItems(data)
    } catch (err: any) {
      console.error('Error fetching experience:', err)
      showToast('error', err.message || 'Failed to load experience')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExperience()
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
    setEditingItem({
      company: '',
      role: '',
      period: '',
      impact: '',
      display_order: items.length,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (item: ExperienceRecord) => {
    setEditingItem({ ...item })
    setIsModalOpen(true)
  }

  const handleDelete = async (id?: string, company?: string) => {
    if (!id) return
    if (!window.confirm(`Delete position at "${company}"?`)) return

    try {
      const { error } = await supabase.from('experience').delete().eq('id', id)
      if (error) throw error

      showToast('success', `Deleted "${company}"`)
      setItems((prev) => prev.filter((i) => i.id !== id))
    } catch (err: any) {
      console.error('Error deleting experience:', err)
      showToast('error', err.message || 'Failed to delete')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem?.company || !editingItem?.role) {
      showToast('error', 'Company and Role are required')
      return
    }

    setIsSaving(true)
    try {
      const payload: any = {
        company: editingItem.company.trim(),
        role: editingItem.role.trim(),
        period: editingItem.period.trim(),
        impact: editingItem.impact.trim(),
        display_order: editingItem.display_order ?? items.length,
      }

      if (editingItem.id) {
        payload.id = editingItem.id
      }

      const { error } = await supabase.from('experience').upsert(payload)
      if (error) throw error

      showToast('success', 'Experience record saved')
      setIsModalOpen(false)
      await fetchExperience()
    } catch (err: any) {
      console.error('Error saving experience:', err)
      showToast('error', err.message || 'Failed to save experience')
    } finally {
      setIsSaving(false)
    }
  }

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= items.length) return

    const newItems = [...items]
    const temp = newItems[index]
    newItems[index] = newItems[targetIndex]
    newItems[targetIndex] = temp

    setItems(newItems)
    try {
      await Promise.all([
        supabase.from('experience').update({ display_order: index }).eq('id', newItems[index].id),
        supabase.from('experience').update({ display_order: targetIndex }).eq('id', newItems[targetIndex].id),
      ])
    } catch (err) {
      console.error('Error updating order:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="section-title heading-gradient">Work Experience</h2>
          <div className="fancy-underline mt-2" />
          <p className="section-subtitle mt-2">Manage your career timeline positions, company highlights, and milestones.</p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold bg-slate-100 text-slate-900 hover:bg-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>Add Position</span>
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

      {/* Experience List matching website timeline card */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 size={24} className="animate-spin text-slate-400" />
          <p className="text-xs text-slate-400">Loading experience...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-10 text-center rounded-2xl darkGlass border border-slate-700/70">
          <Briefcase size={28} className="mx-auto text-slate-400 mb-2" />
          <p className="text-sm font-semibold text-slate-200">No positions found</p>
          <p className="text-xs text-slate-400 mt-1">Click "Add Position" to create an entry.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="darkGlass p-5 sm:p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-slate-600 transition-all shadow-sm hover:shadow-lg group"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm sm:text-base text-slate-100">{item.role}</span>
                  <span className="text-xs text-slate-400">@ {item.company}</span>
                  <span className="text-xs text-slate-400 font-mono">({item.period})</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed whitespace-pre-line pt-1">
                  {item.impact}
                </p>
              </div>

              {/* Actions & Reordering */}
              <div className="flex items-center gap-1.5 self-end sm:self-center flex-shrink-0">
                <button
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-20"
                  title="Move up"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === items.length - 1}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-20"
                  title="Move down"
                >
                  <ChevronDown size={16} />
                </button>
                <button
                  onClick={() => openEditModal(item)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.company)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && editingItem && typeof document !== 'undefined' && createPortal(
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto scrollbar-thin"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="darkGlass border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto scrollbar-thin shadow-2xl space-y-4 bg-slate-900/95"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingItem.id ? 'Edit Experience' : 'Add Position'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp"
                    value={editingItem.company}
                    onChange={(e) => setEditingItem((prev) => (prev ? { ...prev, company: e.target.value } : null))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-slate-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mobile Developer"
                    value={editingItem.role}
                    onChange={(e) => setEditingItem((prev) => (prev ? { ...prev, role: e.target.value } : null))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-slate-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Duration / Period *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jan 2023 - Present"
                  value={editingItem.period}
                  onChange={(e) => setEditingItem((prev) => (prev ? { ...prev, period: e.target.value } : null))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-slate-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Impact & Scope *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Key responsibilities, contributions, and milestones..."
                  value={editingItem.impact}
                  onChange={(e) => setEditingItem((prev) => (prev ? { ...prev, impact: e.target.value } : null))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-slate-500/40"
                />
              </div>

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
                  <span>{isSaving ? 'Saving...' : 'Save Position'}</span>
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
