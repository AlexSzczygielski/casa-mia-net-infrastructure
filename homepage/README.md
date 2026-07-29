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
- Runs as non-root (`PUID`/`PGID: 1000`), the config directory is owned by our own user, not root.
- Mounts `/var/run/docker.sock` read-only for container auto-discovery — optional, but needed for the Docker widget/integration.