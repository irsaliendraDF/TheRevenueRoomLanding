import { renderToString } from 'react-dom/server'
import App from './App.tsx'

/**
 * Server entry used only at build time by scripts/prerender.mjs.
 *
 * renderToString performs a single synchronous render: useEffect never fires,
 * so the scroll listener and confetti animation stay client-only. Every
 * useState initialiser in App is a static literal, which is what lets the
 * client hydrate onto this markup without a mismatch.
 */
export function render() {
  return renderToString(<App />)
}
