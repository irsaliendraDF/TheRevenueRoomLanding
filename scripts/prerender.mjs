/**
 * Build-time prerender for the landing page.
 *
 * The site is a client-rendered Vite SPA, so the HTML served to crawlers was
 * an empty <div id="root">. Meta tags indexed fine, but none of the actual
 * copy did. This renders the app to static HTML at build time and injects it
 * into dist/index.html, so search engines receive the real content.
 *
 * Runs entirely in Node via react-dom/server -- no headless browser -- so it
 * works in CI and on Vercel.
 *
 * Invoked by `npm run build` after the client and SSR bundles are built.
 */
import { readFile, writeFile, rm } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const root = process.cwd()
const clientHtml = path.join(root, 'dist', 'index.html')
const serverEntry = path.join(root, 'dist-ssr', 'entry-server.js')

const PLACEHOLDER = '<div id="root"></div>'

async function main() {
  const html = await readFile(clientHtml, 'utf8')

  if (!html.includes(PLACEHOLDER)) {
    throw new Error(
      `prerender: could not find ${PLACEHOLDER} in dist/index.html. ` +
        `The mount point changed -- update PLACEHOLDER in scripts/prerender.mjs.`,
    )
  }

  const { render } = await import(pathToFileURL(serverEntry).href)
  const appHtml = render()

  if (!appHtml || appHtml.length < 1000) {
    throw new Error(
      `prerender: render() returned only ${appHtml?.length ?? 0} chars, ` +
        `which means the app did not render. Refusing to emit an empty page.`,
    )
  }

  await writeFile(
    clientHtml,
    html.replace(PLACEHOLDER, `<div id="root">${appHtml}</div>`),
    'utf8',
  )

  // The SSR bundle is a build artifact only; keep it out of the deploy output.
  await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true })

  const kb = Math.round(appHtml.length / 1024)
  console.log(`prerender: injected ${kb}KB of static HTML into dist/index.html`)
}

main().catch((err) => {
  console.error(err.message ?? err)
  process.exit(1)
})
