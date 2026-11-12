import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import './index.css'

// Bubble Background Design components & pages
import BubbleHome from './bubble_background_design/pages/Home'
import BubbleProjectDetail from './bubble_background_design/pages/ProjectDetail'
import BubbleBackground from './bubble_background_design/components/BubbleBackground'
import ScrollIndicator from './bubble_background_design/components/ScrollIndicator'
import IntroAnimation from './bubble_background_design/components/IntroAnimation'
import Cursor from './bubble_background_design/components/Cursor'
import { useTheme } from './bubble_background_design/context/ThemeContext'

// Monochrome Design components & pages
import MonochromeHome from './monochrome_design/pages/Home'
import MonochromeProjectDetail from './monochrome_design/pages/ProjectDetail'
import Intro from './monochrome_design/components/Intro'
import MonochromeCursor from './monochrome_design/components/Cursor'

// Global Design Switcher & Admin Gateway
import { useDesignTheme } from './context/DesignThemeContext'
import AdminThemeSelector from './admin/AdminThemeSelector'

export default function App(): React.JSX.Element {
  const location = useLocation()
  const { isDark } = useTheme()
  const { isNewDesign } = useDesignTheme()
  const [hasShownBubbleIntro, setHasShownBubbleIntro] = useState<boolean>(false)
  const [hasShownNewIntro, setHasShownNewIntro] = useState<boolean>(false)

  const isAdminRoute = location.pathname.startsWith('/admin')

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative z-10"
    >
      {/* Intro animation for bubble_background_design */}
      {!isAdminRoute && !isNewDesign && !hasShownBubbleIntro && (
        <IntroAnimation onComplete={() => setHasShownBubbleIntro(true)} />
      )}

      {/* Intro animation for monochrome_design */}
      {!isAdminRoute && isNewDesign && !hasShownNewIntro && (
        <Intro name="Sanyam Mujavadia" onDone={() => setHasShownNewIntro(true)} />
      )}

      {/* Floating bubbles, custom cursor & scroll indicator for bubble_background_design */}
      {!isAdminRoute && !isNewDesign && (
        <>
          <BubbleBackground isDark={isDark} />
          <ScrollIndicator />
          <Cursor />
        </>
      )}

      {/* Custom cursor for monochrome_design */}
      {!isAdminRoute && isNewDesign && <MonochromeCursor />}

      <Routes>
        {/* Secret Admin Design Switcher */}
        <Route path="/admin/:id" element={<AdminThemeSelector />} />

        {/* Public Portfolio Routes (Dynamic between bubble_background_design & monochrome_design) */}
        <Route
          path="/"
          element={isNewDesign ? <MonochromeHome /> : <BubbleHome />}
        />
        <Route
          path="/projects/:id"
          element={isNewDesign ? <MonochromeProjectDetail /> : <BubbleProjectDetail />}
        />

        {/* Redirect any other path to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </motion.div>
  )
}
