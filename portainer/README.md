# Portainer

Web UI for managing Docker on this host — start/stop/inspect containers, view logs, manage volumes and images, without typing raw `docker` commands for everyday checks.

## Access

- `https://192.168.0.136:9443` (direct)
- `https://portainer.casa.mia` (once Caddy + AdGuard are deployed — see repo root README)

## Notes

- Data (users, settings) lives in the external named volume `portainer_data` — this predates the compose setup, so the volume is referenced with `external: true` rather than created fresh. Deleting this stack's container is safe; deleting the volume is not.
- Port `8000` is Portainer's Edge Agent tunnel, used for connecting remote/external Docker environments. Not in use here — safe to leave bound and ignore.
- Needs access to `/var/run/docker.sock` (bind-mounted) to manage other containers on this host — this is a core requirement, not optional.
