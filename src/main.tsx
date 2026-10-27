import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { MockRepository } from './data/MockRepository'
import { DadosProvider } from './state'
import './styles.css'

// Para usar uma API real, troque por: new ApiRepository(import.meta.env.VITE_API_URL)
const repo = new MockRepository(250)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DadosProvider repo={repo}>
      <App />
    </DadosProvider>
  </StrictMode>,
)
