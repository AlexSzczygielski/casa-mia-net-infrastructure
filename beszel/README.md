# Beszel

Lightweight server monitoring — CPU, memory, disk, network, and temperature history with configurable alerts, across every host and VM in this network from one dashboard.

## Access

- `http://192.168.0.136:8090` (direct)
- `https://beszel.casamia-net.top` / `https://beszel.ts.casamia-net.top` (via Caddy)

## Notes

- **Hub-and-agent architecture — this folder is only the hub.** The hub (this service) is the dashboard and stores all metrics history; agents run on each monitored system and report back to it. This repo covers what runs on the Docker VM, so agents for systems outside it aren't tracked here.
- The Proxmox host (`192.168.0.5`) is monitored via a **binary + systemd agent installed directly on PVE**, not a Docker container — same reasoning as Tailscale: Docker on the hypervisor itself is avoided, and host hardware sensors (`/sys/class/hwmon`) aren't visible from inside a VM anyway, so a container in this stack couldn't read them regardless. See the agent's systemd unit on the PVE host for its config, not this repo.
- Data (users, settings, metrics history) lives in a bind mount at `/opt/docker-data/beszel` — see repo root README for the data storage convention.
- Runs as root inside the container, so the data directory is root-owned on the host — this is expected, don't `chown` it to your own user.
- Notifications go through [Shoutrrr](https://github.com/nicholas-fedor/shoutrrr) URL schemes, configured in the hub's web UI under **Settings → Notifications** — not in this repo, since it's runtime state stored in the bind-mounted data dir, not compose config.
- Alert thresholds (e.g. temperature) are set per-system in the web UI, not here — same reasoning as above.