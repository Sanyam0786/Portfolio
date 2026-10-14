import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import BubbleBackground from './components/BubbleBackground'
import './index.css'
import ScrollIndicator from './components/ScrollIndicator'
import { useTheme } from './context/ThemeContext'
import IntroAnimation from './components/IntroAnimation'

// Admin Panel
import { AdminAuthProvider } from './admin/context/AdminAuthContext'
import ProtectedRoute from './admin/components/ProtectedRoute'
import AdminLayout from './admin/components/AdminLayout'
import AdminLogin from './admin/pages/AdminLogin'
import AdminDashboard from './admin/pages/AdminDashboard'
import ManageProjects from './admin/pages/ManageProjects'
import ManageSkills from './admin/pages/ManageSkills'
import ManageExperience from './admin/pages/ManageExperience'
import ManageEducation from './admin/pages/ManageEducation'
import ManageProfile from './admin/pages/ManageProfile'

export default function App(): React.JSX.Element {
  const location = useLocation()
  const { isDark } = useTheme()
  const [hasShownIntro, setHasShownIntro] = useState<boolean>(false)

  const isAdminRoute = location.pathname.startsWith('/admin')

  // Scroll to top whenever route changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <AdminAuthProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen relative z-10"
      >
        {/* Intro typing animation only on public pages */}
        {!isAdminRoute && !hasShownIntro && (
          <IntroAnimation onComplete={() => setHasShownIntro(true)} />
        )}

        {/* Ambient floating bubbles only on public portfolio pages */}
        {!isAdminRoute && <BubbleBackground isDark={isDark} />}
        {!isAdminRoute && <ScrollIndicator />}

        <Routes>
          {/* Public Portfolio Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ManageProjects />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/skills"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ManageSkills />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/experience"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ManageExperience />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/education"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ManageEducation />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ManageProfile />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AdminAuthProvider>
  )
}
