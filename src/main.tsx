import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { PlatformProvider } from './context/PlatformContext'
import { MatrizAuthProvider } from './hooks/useMatrizAuth'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PlatformProvider>
        <MatrizAuthProvider>
          <App />
        </MatrizAuthProvider>
      </PlatformProvider>
    </BrowserRouter>
  </StrictMode>,
)
