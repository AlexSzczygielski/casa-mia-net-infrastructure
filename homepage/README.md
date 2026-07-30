# Homepage

Self-hosted dashboard — a single landing page with links and live status widgets for services running across the homelab (Portainer, Uptime Kuma, Proxmox, etc).

[Homepage Docs](https://gethomepage.dev)

## Access

- [http://192.168.0.136:3004](http://192.168.0.136:3004) (LAN)
- [http://debian-prox-docker:3004](http://debian-prox-docker:3004) (Tailscale / MagicDNS)

## Notes

- Config is hand-authored YAML (`services.yaml`, `widgets.yaml`, `settings.yaml`, `bookmarks.yaml`, `docker.yaml`), not runtime state
— Config is kept in-repo under `homepage/config/`, not `/opt/docker-data`. This is an intentional exception to the repo's data storage convention: that convention is for backing up state, and this is source.
- `config/logs/` is gitignored — Homepage writes runtime logs there, not something we author.
- Runs as non-root (`PUID: 1000` / `PGID: 989`) — `PGID` is set to the host's `docker` group GID (`getent group docker`), not `1000`, because Homepage's entrypoint drops privileges to `PUID`/`PGID` without carrying over `group_add` supplementary groups. This is what grants the container's actual running process (not just its root exec context) access to `/var/run/docker.sock`.
- Mounts `/var/run/docker.sock` read-only — used for the Docker widget (live container status/stats), not label-based auto-discovery (**not currently used**; all services are hand-authored in `services.yaml`). This grants root-equivalent host access if the container is ever compromised — accepted tradeoff for a LAN-only, non-exposed dashboard.
- Proxmox widget uses an API token (`root@pam!homepage`) with **Privilege Separation** enabled — the token itself needs its own permission grant (`PVEAuditor` on path `/`, propagated) in Proxmox, separate from the user account's own permissions.