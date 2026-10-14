import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import Cursor from './components/Cursor'
import { ThemeProvider } from './context/ThemeContext'
import { IntroProvider } from './context/IntroContext'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <IntroProvider>
        <BrowserRouter>
          <App />
          <Cursor />
        </BrowserRouter>
      </IntroProvider>
    </ThemeProvider>
  </React.StrictMode>
)
