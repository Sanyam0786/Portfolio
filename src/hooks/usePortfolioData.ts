import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { projects as fallbackProjects } from '../../data/projects'
import { skills as fallbackSkills } from '../../data/skills'
import { experience as fallbackExperience } from '../../data/experience'
import { education as fallbackEducation } from '../../data/education'
import { contact as fallbackContact } from '../../data/contact'
import { featuresSentences as fallbackSentences } from '../../data/home'
import { ProjectItem, SkillItem, ExperienceItem, EducationItem, ContactInfo } from '../types'

export interface PortfolioData {
  projects: ProjectItem[]
  skills: SkillItem[]
  experience: ExperienceItem[]
  education: EducationItem[]
  contact: ContactInfo
  heroSentences: string[]
  isLoading: boolean
  isFromSupabase: boolean
  refresh: () => Promise<void>
}

export function usePortfolioData(): PortfolioData {
  const [projects, setProjects] = useState<ProjectItem[]>(fallbackProjects)
  const [skills, setSkills] = useState<SkillItem[]>(fallbackSkills)
  const [experience, setExperience] = useState<ExperienceItem[]>(fallbackExperience)
  const [education, setEducation] = useState<EducationItem[]>(fallbackEducation)
  const [contact, setContact] = useState<ContactInfo>(fallbackContact)
  const [heroSentences, setHeroSentences] = useState<string[]>(fallbackSentences)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isFromSupabase, setIsFromSupabase] = useState<boolean>(false)

  const fetchData = async () => {
    if (!isSupabaseConfigured) {
      setIsLoading(false)
      return
    }

    try {
      // Parallel fetch from all tables
      const [
        { data: projData, error: projErr },
        { data: skillData, error: skillErr },
        { data: expData, error: expErr },
        { data: eduData, error: eduErr },
        { data: profData, error: profErr },
      ] = await Promise.all([
        supabase.from('projects').select('*').order('display_order', { ascending: true }),
        supabase.from('skills').select('*').order('display_order', { ascending: true }),
        supabase.from('experience').select('*').order('display_order', { ascending: true }),
        supabase.from('education').select('*').order('display_order', { ascending: true }),
        supabase.from('profile').select('*').limit(1).maybeSingle(),
      ])

      let loadedFromDb = false

      if (!projErr && projData && projData.length > 0) {
        setProjects(
          projData.map((p) => ({
            id: p.id,
            title: p.title,
            role: p.role,
            description: p.description,
            tags: p.tags || [],
            coverImage: p.cover_image,
            screenshots: p.screenshots || [],
            demo: p.demo || {},
            highlights: p.highlights || [],
            features: p.features || [],
            challenges: p.challenges || [],
            impact: p.impact || [],
            github: p.github,
          }))
        )
        loadedFromDb = true
      }

      if (!skillErr && skillData && skillData.length > 0) {
        setSkills(
          skillData.map((s) => ({
            name: s.name,
            icon: s.icon,
            level: s.level || 'Expert',
          }))
        )
        loadedFromDb = true
      }

      if (!expErr && expData && expData.length > 0) {
        setExperience(
          expData.map((e) => ({
            company: e.company,
            role: e.role,
            period: e.period,
            impact: e.impact,
          }))
        )
        loadedFromDb = true
      }

      if (!eduErr && eduData && eduData.length > 0) {
        setEducation(
          eduData.map((ed) => ({
            school: ed.school,
            degree: ed.degree,
            period: ed.period,
            notes: ed.notes,
          }))
        )
        loadedFromDb = true
      }

      if (!profErr && profData) {
        setContact({
          name: profData.name || fallbackContact.name,
          role: profData.role || fallbackContact.role,
          email: profData.email || fallbackContact.email,
          linkedin: profData.linkedin || fallbackContact.linkedin,
          whatsapp: profData.whatsapp || fallbackContact.whatsapp,
          github: profData.github || fallbackContact.github,
          formspree: profData.formspree || fallbackContact.formspree,
        })
        if (Array.isArray(profData.hero_sentences) && profData.hero_sentences.length > 0) {
          setHeroSentences(profData.hero_sentences)
        }
        loadedFromDb = true
      }

      setIsFromSupabase(loadedFromDb)
    } catch (err) {
      console.warn('Could not fetch from Supabase, using local fallback:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    projects,
    skills,
    experience,
    education,
    contact,
    heroSentences,
    isLoading,
    isFromSupabase,
    refresh: fetchData,
  }
}
