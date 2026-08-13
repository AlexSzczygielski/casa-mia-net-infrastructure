# Vaultwarden

Self-hosted Bitwarden-compatible password manager — vault for this homelab's service credentials (Portainer, Uptime Kuma, etc.), accessed via browser extension or the web vault.

[Vaultwarden Wiki](https://github.com/dani-garcia/vaultwarden/wiki)

## Access

- LAN:
  ```
  https://vaultwarden.casamia-net.top
  ```
- Tailscale:
  ```
  https://vaultwarden.ts.casamia-net.top
  ```

No host port is published — reachable only through Caddy on the shared Compose network, not directly by IP.

## Notes

- Data (vault entries, user accounts, attachments) lives in a bind mount at `/opt/docker-data/vaultwarden` — see repo root README for the data storage convention.
- `ADMIN_TOKEN` is not set, so the `/admin` server-management panel is disabled entirely.
- `SIGNUPS_ALLOWED` is also not set, which means it's on the image's default of `true` — **open signups are currently live** on a vault in daily use. Set `SIGNUPS_ALLOWED: "false"` in the compose file once the accounts that need one exist.