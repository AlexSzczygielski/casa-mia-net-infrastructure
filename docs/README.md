# Casa Mia Network — Docs Site

VitePress-powered documentation site for the `casa-mia-net-infrastructure`
repo, deployed to GitHub Pages via GitHub Actions.

## How it works

- Each service's own `README.md` (living in its service folder at the repo
  root) is the single source of truth — pages under `docs/services/` are
  thin `@include` pointers into those READMEs, not copies.
- `docs/.vitepress/config.ts` auto-discovers services at build time: any
  repo-root folder containing a `README.md`, plus any top-level `.md` file
  not on the `EXCLUDED_FILES` list, gets a stub page and a sidebar entry
  generated automatically. Adding a new service needs no manual edits here.
- Mermaid diagrams (including `architecture-beta`) render natively via
  `vitepress-plugin-mermaid`.
- `docs/index.md` is the hand-written homepage (hero, feature cards) — not
  auto-generated, edit directly.

## Local development

```bash
cd docs
npm install
npm run docs:dev       # dev server with hot reload, http://localhost:5173
npm run docs:build     # production build, output to docs/.vitepress/dist
```

## Deployment

Pushing to `main` triggers `.github/workflows/docs.yml`, which builds and
publishes automatically to GitHub Pages. No manual deploy step. Triggered
by changes to `docs/**` or any `**/README.md` in the repo.

## Structure

```
docs/
├── .vitepress/
│   ├── config.ts      # nav, sidebar, auto-discovery logic, Mermaid config
│   └── public/         # static assets (.nojekyll, etc.)
├── index.md            # homepage
└── services/           # auto-generated @include stub pages (don't hand-edit
                          # existing ones — they regenerate; editing the
                          # linked README is the correct place to make changes)
```

## Notes

- `base` in `config.ts` must match the repo name (`/casa-mia-net-infrastructure/`)
  for GitHub Pages to serve assets correctly — update if the repo is ever renamed.
- Cross-references between READMEs should use absolute GitHub URLs, not
  relative paths — relative links break once included into a `services/`
  page at a different URL.