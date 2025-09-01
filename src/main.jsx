import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import AppMobileOnly from './AppMobileOnly.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppMobileOnly />
  </StrictMode>,
)
