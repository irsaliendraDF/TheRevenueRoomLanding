import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')!

// The production build is prerendered to static HTML (scripts/prerender.mjs),
// so attach via hydrateRoot to adopt that markup instead of discarding it and
// repainting. Falls back to createRoot when #root is empty, which is the case
// during `vite dev` and if prerendering is ever skipped.
if (root.hasChildNodes()) {
  hydrateRoot(
    root,
    <StrictMode>
      <App />
    </StrictMode>,
  )
} else {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
