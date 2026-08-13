# Uptime Kuma

Self-hosted uptime monitoring — pings services on a schedule and shows status history, response times, and alerting.

[Uptime Kuma Docs](https://github.com/louislam/uptime-kuma/wiki)

## Access

- Direct:
  ```
  http://192.168.0.136:3001
  ```
- Via Caddy, LAN:
  ```
  https://uptime-kuma.casamia-net.top
  ```
- Via Caddy, Tailscale:
  ```
  https://uptime-kuma.ts.casamia-net.top
  ```

## Notes

- Data (monitors, users, notification settings, history) lives in a bind mount at `/opt/docker-data/uptime-kuma` — see repo root README for the data storage convention.
- Monitors and notification integrations are configured in the web UI, not in this repo — same reasoning as Beszel: it's runtime state stored in the bind-mounted data dir, not compose config.
