# Workflows

GitHub Actions workflows for this repo.

## `docs.yml` — Deploy docs

Builds the VitePress site under `docs/` and publishes it to GitHub Pages.

- **Trigger:** push to `main` touching `docs/**`, any `**/README.md`,
  `backup-plan.md`, or the workflow file itself. Also manually runnable
  via `workflow_dispatch`.
- **Jobs:** `build` (checkout → install → `npm run docs:build` → upload
  artifact) → `deploy` (publishes to GitHub Pages).
- **Requires:** `docs/package-lock.json` committed (dependency cache
  depends on it) and Pages source set to **GitHub Actions** in repo
  Settings, not "Deploy from a branch."

<!--
Add new workflows below as their own section, same format:

## <filename>.yml — <one-line purpose>

- **Trigger:** ...
- **Jobs:** ...
- **Requires:** ... (only if there's a non-obvious setup dependency)
-->