import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'
import './i18n'

// @ts-expect-error virtual module by vite-plugin-pwa
import { registerSW } from 'virtual:pwa-register'
registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
