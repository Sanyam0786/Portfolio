import { supabase } from '../../lib/supabase'
import { convertToWebP } from './imageOptimizer'
import { skills as localSkills } from '../../../data/skills'
import { projects as localProjects } from '../../../data/projects'

export interface MigrationProgress {
  step: 'idle' | 'converting_skills' | 'converting_projects' | 'updating_db' | 'done' | 'error'
  current: number
  total: number
  currentItem: string
  error?: string
}

/**
 * Checks if an asset path represents an active, valid local or remote image.
 * Explicitly ignores anything from 'unused' folders or empty/undefined assets.
 */
function isValidActiveAsset(assetUrl: unknown): boolean {
  if (!assetUrl || typeof assetUrl !== 'string') return false
  const trimmed = assetUrl.trim()
  if (!trimmed) return false
  // Strictly skip any assets from unused/archived folders
  if (trimmed.includes('/unused/') || trimmed.includes('\\unused\\') || trimmed.includes('unused/')) {
    return false
  }
  return true
}

/**
 * Converts a static asset into WebP and uploads to Supabase Storage.
 * If the asset is already a remote Supabase/HTTPS URL, skips re-uploading and returns the URL as-is.
 */
async function uploadAssetAsWebP(
  assetUrl: string,
  destinationPath: string
): Promise<string> {
  // If already hosted on remote storage, do not re-upload
  if (assetUrl.startsWith('http://') || assetUrl.startsWith('https://')) {
    return assetUrl
  }

  // Safety check: never upload unused assets
  if (!isValidActiveAsset(assetUrl)) {
    return ''
  }

  const res = await fetch(assetUrl)
  if (!res.ok) throw new Error(`Failed to load static asset from: ${assetUrl}`)

  const rawBlob = await res.blob()
  const rawFile = new File([rawBlob], destinationPath.split('/').pop() || 'image.png', {
    type: rawBlob.type || 'image/png',
  })

  // Convert to high-performance WebP
  const { blob: webpBlob, contentType } = await convertToWebP(rawFile, 0.90)

  // Upload to Supabase Storage portfolio-media bucket
  const { data, error: uploadErr } = await supabase.storage
    .from('portfolio-media')
    .upload(destinationPath, webpBlob, {
      contentType: contentType || 'image/webp',
      cacheControl: '31536000',
      upsert: true,
    })

  if (uploadErr) throw uploadErr

  const { data: publicUrlData } = supabase.storage
    .from('portfolio-media')
    .getPublicUrl(data.path)

  return publicUrlData.publicUrl
}

/**
 * Migrates ONLY actively used skills and project images to Supabase Storage as WebP.
 * Strictly ignores unused icons, unused projects, and archived files.
 */
export async function migrateAllStaticImagesToWebP(
  onProgress?: (p: MigrationProgress) => void
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Filter ONLY active skills that have a valid icon (not from 'unused')
    const activeSkills = localSkills.filter(
      (s) => s.name?.trim() && isValidActiveAsset(s.icon)
    )
    const updatedSkills: Array<{ name: string; icon: string; level: string; display_order: number }> = []

    for (let i = 0; i < activeSkills.length; i++) {
      const skill = activeSkills[i]
      const iconAsset = skill.icon as string
      const sanitizedName = skill.name.toLowerCase().replace(/[^a-z0-9]/g, '_')
      const targetPath = `skills/${sanitizedName}.webp`

      onProgress?.({
        step: 'converting_skills',
        current: i + 1,
        total: activeSkills.length,
        currentItem: `Active Skill: ${skill.name}`,
      })

      const storageUrl = await uploadAssetAsWebP(iconAsset, targetPath)
      updatedSkills.push({
        name: skill.name,
        icon: storageUrl,
        level: skill.level || 'Expert',
        display_order: i,
      })
    }

    // 2. Filter ONLY active, published projects (ignoring commented-out or unused ones)
    const activeProjects = localProjects.filter((p) => p.id?.trim())
    const updatedProjects = []

    for (let pIdx = 0; pIdx < activeProjects.length; pIdx++) {
      const proj = activeProjects[pIdx]
      onProgress?.({
        step: 'converting_projects',
        current: pIdx + 1,
        total: activeProjects.length,
        currentItem: `Active Project: ${proj.title}`,
      })

      // Convert Cover Image (only if not in unused)
      let coverStorageUrl = ''
      if (isValidActiveAsset(proj.coverImage)) {
        coverStorageUrl = await uploadAssetAsWebP(
          proj.coverImage as string,
          `projects/${proj.id}/cover.webp`
        )
      }

      // Convert ONLY active screenshots (filtering out any unused)
      const validScreenshots = (proj.screenshots || []).filter(isValidActiveAsset)
      const screenshotUrls: string[] = []

      for (let sIdx = 0; sIdx < validScreenshots.length; sIdx++) {
        const shotUrl = validScreenshots[sIdx] as string
        const shotStorageUrl = await uploadAssetAsWebP(
          shotUrl,
          `projects/${proj.id}/screenshot_${sIdx + 1}.webp`
        )
        if (shotStorageUrl) {
          screenshotUrls.push(shotStorageUrl)
        }
      }

      updatedProjects.push({
        id: proj.id,
        title: proj.title,
        role: proj.role,
        description: proj.description,
        tags: proj.tags,
        cover_image: coverStorageUrl,
        screenshots: screenshotUrls,
        demo: proj.demo || {},
        highlights: proj.highlights || [],
        features: proj.features || [],
        challenges: proj.challenges || [],
        impact: proj.impact || [],
        github: proj.github || '',
        display_order: pIdx,
        is_published: true,
      })
    }

    // 3. Update Supabase Database Tables with Storage URLs
    onProgress?.({
      step: 'updating_db',
      current: 1,
      total: 2,
      currentItem: 'Updating active database records with storage URLs...',
    })

    // Upsert active skills
    if (updatedSkills.length > 0) {
      const { error: skillDbErr } = await supabase
        .from('skills')
        .upsert(updatedSkills, { onConflict: 'name' })
      if (skillDbErr) throw skillDbErr
    }

    // Upsert active projects
    if (updatedProjects.length > 0) {
      const { error: projDbErr } = await supabase
        .from('projects')
        .upsert(updatedProjects, { onConflict: 'id' })
      if (projDbErr) throw projDbErr
    }

    onProgress?.({
      step: 'done',
      current: activeSkills.length + activeProjects.length,
      total: activeSkills.length + activeProjects.length,
      currentItem: 'Active images successfully converted and stored in WebP Storage!',
    })

    return { success: true }
  } catch (err: any) {
    console.error('Migration failed:', err)
    onProgress?.({
      step: 'error',
      current: 0,
      total: 0,
      currentItem: '',
      error: err.message || 'Storage migration failed',
    })
    return { success: false, error: err.message }
  }
}
