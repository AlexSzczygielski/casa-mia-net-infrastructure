# Homepage

Self-hosted dashboard — a single landing page with links and live status widgets for services running across the homelab (Portainer, Uptime Kuma, Proxmox, etc).

[Homepage Docs](https://gethomepage.dev)

## Access

- Direct:
  ```
  http://192.168.0.136:3004
  ```
- Via Caddy, LAN (catch-all — also what any unmatched `*.casamia-net.top` subdomain resolves to):
  ```
  https://casamia-net.top
  ```
- Via Caddy, Tailscale (catch-all — also what any unmatched `*.ts.casamia-net.top` subdomain resolves to):
  ```
  https://ts.casamia-net.top
  ```

## Notes

- Config is hand-authored YAML (`services.yaml`, `widgets.yaml`, `settings.yaml`, `bookmarks.yaml`, `docker.yaml`), not runtime state
— Config is kept in-repo under `homepage/config/`, not `/opt/docker-data`. This is an intentional exception to the repo's data storage convention: that convention is for backing up state, and this is source.
- `config/logs/` is gitignored — Homepage writes runtime logs there, not something we author.
- Runs as non-root (`PUID: 1000` / `PGID: 1000`), plus the host's `docker` group GID (`getent group docker`) added as a supplementary group via `group_add: ["989"]` — needed because Homepage's entrypoint drops privileges to `PUID`/`PGID` without carrying over supplementary groups on its own. This is what grants the container's actual running process (not just its root exec context) access to `/var/run/docker.sock`.
- Mounts `/var/run/docker.sock` read-only — used for the Docker widget (live container status/stats), not label-based auto-discovery (**not currently used**; all services are hand-authored in `services.yaml`). This grants root-equivalent host access if the container is ever compromised — accepted tradeoff for a LAN-only, non-exposed dashboard.
- Proxmox widget uses an API token (`root@pam!homepage`) with **Privilege Separation** enabled — the token itself needs its own permission grant (`PVEAuditor` on path `/`, propagated) in Proxmox, separate from the user account's own permissions.
- Background image lives in `config/images/`, mounted to `/app/public/images` (separate volume mount from `config:/app/config`). Adding or changing the image requires a full container restart (`docker compose up -d --force-recreate homepage`) — Homepage's own refresh button isn't enough, since `public/` is served as part of a static build.