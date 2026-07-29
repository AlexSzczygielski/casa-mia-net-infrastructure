# Vaultwarden

*Abandoned for now - needs proper SSL config*

Self-hosted Bitwarden-compatible password manager — vault for this homelab's service credentials (Portainer, Uptime Kuma, etc.), accessed via browser extension or the web vault.

## Access

- `http://192.168.0.136:8000` (LAN-wide — temporary, see Notes)
- `https://vault.casa.mia` (planned, once Tailscale + a real cert are in place)

## Notes

- **Port is currently bound LAN-wide (`"8000:80"`), not `127.0.0.1`-only — this is temporary.** It was opened up to skip SSH-tunnel friction during initial setup. Revert to `"127.0.0.1:8000:80"` (or move fully to Tailscale) once Tailscale is deployed, so this isn't sitting reachable to the whole home network indefinitely.
- Data (vault entries, user accounts, attachments) lives in a bind mount at `/opt/docker-data/vaultwarden` — see repo root README for the data storage convention.
- `SIGNUPS_ALLOWED` starts as `"true"` to allow first-account creation, then must be flipped to `"false"` in the compose file and reapplied (`docker compose up -d`) once your account exists. Check this hasn't been left open — matters more right now given the LAN-wide binding above.
- `ADMIN_TOKEN` protects `/admin`, a separate server-management panel (not vault data) — value lives in a gitignored `.env` file in this folder, not in the compose file, since the repo is public.