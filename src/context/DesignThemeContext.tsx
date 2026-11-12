import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type DesignTheme = 'bubble' | 'monochrome_design' | 'new_design' | 'newdesign' | 'classic' | 'monochrome'

interface DesignThemeContextType {
  activeTheme: DesignTheme
  setActiveTheme: (theme: DesignTheme) => void
  isNewDesign: boolean
  isBubble: boolean
  /** Alias for backward compatibility */
  isMonochrome: boolean
  /** Alias for backward compatibility */
  isClassic: boolean
}

const STORAGE_KEY = 'portfolio_design_theme'

function normalizeTheme(theme: string | null): DesignTheme | null {
  if (!theme) return null
  const normalized = theme.toLowerCase().trim()
  if (normalized === 'bubble' || normalized === 'bubble_background_design' || normalized === 'bubblebackground' || normalized === 'classic') {
    return 'bubble'
  }
  if (normalized === 'monochrome_design' || normalized === 'new_design' || normalized === 'newdesign' || normalized === 'monochrome' || normalized === 'new') {
    return 'monochrome_design'
  }
  return null
}

const DesignThemeContext = createContext<DesignThemeContextType | undefined>(undefined)

export function DesignThemeProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [activeTheme, setActiveThemeState] = useState<DesignTheme>(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const themeParam = params.get('theme') || params.get('design')
      const normalizedParam = normalizeTheme(themeParam)
      if (normalizedParam) {
        localStorage.setItem(STORAGE_KEY, normalizedParam)
        return normalizedParam
      }

      const saved = localStorage.getItem(STORAGE_KEY)
      const normalizedSaved = normalizeTheme(saved)
      if (normalizedSaved) {
        return normalizedSaved
      }
    } catch {
      // LocalStorage unavailable
    }
    return 'bubble'
  })

  const setActiveTheme = (theme: DesignTheme) => {
    const normalized = normalizeTheme(theme) || 'bubble'
    setActiveThemeState(normalized)
    try {
      localStorage.setItem(STORAGE_KEY, normalized)
    } catch {
      // Ignore local storage error
    }
  }

  // Sync across tabs if user changes theme in another tab
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const normalized = normalizeTheme(e.newValue)
        if (normalized) {
          setActiveThemeState(normalized)
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const isNew = activeTheme === 'monochrome_design' || activeTheme === 'new_design' || activeTheme === 'newdesign' || activeTheme === 'monochrome'
  const isBub = activeTheme === 'bubble' || activeTheme === 'classic'

  return (
    <DesignThemeContext.Provider
      value={{
        activeTheme,
        setActiveTheme,
        isNewDesign: isNew,
        isBubble: isBub,
        isMonochrome: isNew,
        isClassic: isBub,
      }}
    >
      {children}
    </DesignThemeContext.Provider>
  )
}

export function useDesignTheme(): DesignThemeContextType {
  const context = useContext(DesignThemeContext)
  if (!context) {
    throw new Error('useDesignTheme must be used within a DesignThemeProvider')
  }
  return context
}
