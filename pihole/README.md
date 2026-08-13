# Pi-hole

Network-wide DNS sinkhole — blocks ads and trackers by refusing to resolve known ad/tracker domains for every device that uses it as a DNS server. Also serves custom local + Tailscale domain resolution for reverse-proxied services.

[Pi-hole Docs](https://docs.pi-hole.net)

## Access

- DNS: `192.168.0.136:53`
- Web UI: [http://192.168.0.136:8081/admin](http://192.168.0.136:8081/admin)

## Custom domains

Two-domain split for LAN vs. Tailscale access (not true split-horizon — see trade-off below):

| Pattern | Resolves to |
|---|---|
| `<service>.casamia-net.top` | LAN IP (`192.168.0.136`) |
| `<service>.ts.casamia-net.top` | Docker VM's Tailscale IP |

Set via `FTLCONF_misc_dnsmasq_lines` — `dnsmasq` resolves overlapping wildcards
by most-specific-domain-wins, so `ts.casamia-net.top` and everything under it
correctly takes precedence over the base domain's wildcard.

> [!NOTE]
> This is two fixed domains, not interface-aware split-horizon — a client
> gets a different *URL* depending on network, not the same URL resolving
> differently. Trade-off: services like Vaultwarden see the LAN and Tailscale
> hostnames as separate origins, so logins/sessions don't carry over between
> them. True split-horizon (one URL, resolves per-interface) requires switching this container
> to `network_mode: host` — not done here, since Docker's bridge network
> only exposes its own virtual interface to Pi-hole, not the host's real LAN/
> `tailscale0` interfaces, so interface-based resolution can't work under the
> current bridge + port-mapping setup.

Certificates covering these are handled entirely by Caddy via Cloudflare
DNS-01 (registrar: Porkbun, DNS host: Cloudflare) — a wildcard only covers
one label of depth, so `*.casamia-net.top` does **not** cover
`foo.ts.casamia-net.top`; this is why the wildcard split above exists as two
separate patterns rather than one. See [Caddy's README](https://github.com/AlexSzczygielski/casa-mia-net-infrastructure/blob/main/caddy/README.md)
for how certificates are actually issued and structured.

## Notes

- Web UI is bound to host port `8081`, not the default `80/443` — those are reserved for Caddy. Pi-hole's own HTTPS (443) is unused here.
- `FTLCONF_dns_listeningMode: ALL` is required — Docker's bridge network only exposes the container's own virtual interface to Pi-hole, so it can't tell which host interface a query really arrived on, and the safer `LOCAL` mode (interface/subnet-based filtering) doesn't work reliably as a result. This is safe specifically because the ISP router can't port-forward (CGNAT/DS-Lite) — port 53 is only ever reachable from LAN and the tailnet, never the public internet.
- Upstream DNS pinned to Cloudflare (`1.1.1.1`, `1.0.0.1`) via `FTLCONF_dns_upstreams` — not left as image default.
- Privacy level is set to **3 (Anonymous mode)** — Pi-hole does not log which domains or clients made which queries, only aggregate/anonymous stats. Blocking is unaffected by this; it only controls history/statistics storage.
- Only Pi-hole's single default blocklist is active. No additional lists (e.g. from firebog.net) have been added yet.
- Client devices are configured with Pi-hole as their **only** DNS server (no fallback resolver above or below it) — if Pi-hole goes down, DNS resolution fails outright for those devices rather than silently falling back and losing ad-blocking. [**current setup, where router cant be pointed at DNS, concerns only devices with manually overridden DNS setting from 192.168.0.1 to 192.168.0.136**]

## `.env`

Gitignored, lives alongside `docker-compose.yml`. Required keys:

```bash
PIHOLE_PASSWORD=...              # Web UI / API auth
DOCKER_VM_TAILSCALE_IP=100.x.x.x # Docker VM's own tailnet IP
```

> [!NOTE]
> **Future improvement:** currently created and populated by hand on the
> Docker VM. These values could instead be
> stored as **GitHub Actions repository secrets** and written to `.env` as a
> deploy step — removing the manual "recreate `.env` after a fresh clone"
> step and keeping secret values out of the VM's disk between deploys.