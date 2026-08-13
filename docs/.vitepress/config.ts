import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// ---------------------------------------------------------------------
// Auto-discovery: scan the repo root for service folders and generate
// both the sidebar AND the services/<service>.md stub pages automatically.
// Add a new service folder with its own README.md → it just appears
// here on the next `npm run docs:dev` or `docs:build`. Nothing in this
// file needs manual edits when services are added, removed, or renamed.
//
// ---------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '../../') // docs/.vitepress -> docs -> repo root
const SERVICES_DIR = path.resolve(__dirname, '../services')

// Folders that are never services, even though they may contain
// markdown or live at repo root.
const EXCLUDED_DIRS = new Set([
  'docs',
  '.git',
  '.github',
  'node_modules',
])

// Top-level loose .md files that are working notes, not published docs.
// Add filenames here to keep them out of the sidebar without deleting them.
const EXCLUDED_FILES = new Set([
  'README.md', // handled separately by services/overview.md
])

function humanize(name: string): string {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\.md$/i, '')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function discoverServiceDirs(): { slug: string; title: string }[] {
  return fs
    .readdirSync(REPO_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !EXCLUDED_DIRS.has(entry.name))
    .filter((entry) =>
      fs.existsSync(path.join(REPO_ROOT, entry.name, 'README.md'))
    )
    .map((entry) => ({ slug: entry.name, title: humanize(entry.name) }))
}

function discoverTopLevelDocs(): { slug: string; title: string }[] {
  return fs
    .readdirSync(REPO_ROOT, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith('.md') &&
        !EXCLUDED_FILES.has(entry.name)
    )
    .map((entry) => ({
      slug: entry.name.replace(/\.md$/i, ''),
      title: humanize(entry.name),
    }))
}

function ensureServicePage(slug: string, includeTarget: string) {
  const pagePath = path.join(SERVICES_DIR, `${slug}.md`)
  if (!fs.existsSync(pagePath)) {
    fs.writeFileSync(pagePath, `<!--@include: ${includeTarget}-->\n`)
  }
}

const services = discoverServiceDirs()
const topLevelDocs = discoverTopLevelDocs()

if (!fs.existsSync(SERVICES_DIR)) fs.mkdirSync(SERVICES_DIR, { recursive: true })

for (const { slug } of services) {
  ensureServicePage(slug, `../../${slug}/README.md`)
}
for (const { slug } of topLevelDocs) {
  ensureServicePage(slug, `../../${slug}.md`)
}

const sidebarItems = [...services, ...topLevelDocs]
  .sort((a, b) => a.title.localeCompare(b.title))
  .map(({ slug, title }) => ({ text: title, link: `/services/${slug}` }))

// ---------------------------------------------------------------------

export default withMermaid({
  title: 'Casa Mia Network',
  description: 'Homelab infrastructure documentation',

  // IMPORTANT: must match the repo name for GitHub Pages project sites.
  base: '/casa-mia-net-infrastructure/',

  themeConfig: {
    nav: [
      { text: 'Services', link: '/services/overview' },
      {
        text: 'GitHub',
        link: 'https://github.com/AlexSzczygielski/casa-mia-net-infrastructure',
      },
    ],

    sidebar: [
      {
        text: 'Overview',
        items: [{ text: 'Introduction', link: '/services/overview' }],
      },
      {
        text: 'Services',
        items: sidebarItems,
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/AlexSzczygielski/casa-mia-net-infrastructure',
      },
    ],

    search: {
      provider: 'local',
    },

    editLink: {
      pattern:
        'https://github.com/AlexSzczygielski/casa-mia-net-infrastructure/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },

  // Keep dead-link checking on: if a @include target moves without the
  // guide page being updated, the build should fail loudly rather than
  // silently ship a blank page.
  ignoreDeadLinks: false,

  // Fixes a known ESM/CJS interop bug between mermaid and Vite's
  // dependency pre-bundler ("Importing binding name 'default' cannot be
  // resolved by star export entries" / "ambiguous indirect export").
  // Without this, some Mermaid diagram types fail at render time in the
  // browser even though the build itself succeeds — Vite's pre-bundler
  // needs to be told explicitly to process these packages.
  vite: {
    optimizeDeps: {
      include: ['@braintree/sanitize-url', 'dayjs'],
    },
    resolve: {
      alias: {
        dayjs: 'dayjs/',
      },
    },
  },

  mermaid: {
    // theme is set to match VitePress's own light/dark toggle automatically
  },
})
