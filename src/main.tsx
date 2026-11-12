import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { ThemeProvider } from './bubble_background_design/context/ThemeContext'
import { IntroProvider } from './bubble_background_design/context/IntroContext'
import { DesignThemeProvider } from './context/DesignThemeContext'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <IntroProvider>
        <DesignThemeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </DesignThemeProvider>
      </IntroProvider>
    </ThemeProvider>
  </React.StrictMode>
)
