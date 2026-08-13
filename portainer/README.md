# Portainer

Web UI for managing Docker on this host — start/stop/inspect containers, view logs, manage volumes and images, without typing raw `docker` commands for everyday checks.

[Portainer Docs](https://docs.portainer.io)

## Access

- Direct:
  ```
  https://192.168.0.136:9443
  ```
- Via Caddy, LAN:
  ```
  https://portainer.casamia-net.top
  ```
- Via Caddy, Tailscale:
  ```
  https://portainer.ts.casamia-net.top
  ```

## Notes

- `TRUSTED_ORIGINS` is set to `portainer.casamia-net.top,portainer.ts.casamia-net.top` — Portainer rejects requests with an unrecognized `Host` header otherwise, which would break access through Caddy.
- Data (users, settings) lives in a bind mount at `/opt/docker-data/portainer` — see repo root README for the data storage convention. This was migrated off an external named volume (`portainer_data`, now removed) to bring it in line with the rest of the stack.
- Runs as root inside the container, so the data directory is root-owned on the host — this is expected, don't `chown` it to your own user.
- Port `8000` is Portainer's Edge Agent tunnel, used for connecting remote/external Docker environments. Not in use here — safe to leave bound and ignore.
- Needs access to `/var/run/docker.sock` (bind-mounted) to manage other containers on this host — this is a core requirement, not optional.