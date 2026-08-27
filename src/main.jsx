import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Toaster} from 'sonner'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster position='bottom-center' richColors closeButton duration={3000} theme='system'/>
    <App />
  </StrictMode>,
)
