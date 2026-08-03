# Caddy

Reverse proxy for all services — terminates TLS at the edge using
Let's Encrypt certificates issued via Cloudflare DNS-01, so nothing else on
the stack needs its own cert or public exposure.

[Caddy Docs](https://caddyserver.com/docs/) · [caddy-cloudflare image](https://github.com/CaddyBuilds/caddy-cloudflare)

## Access

- HTTP: `80` (redirects to HTTPS automatically)
- HTTPS: `443`

## Certificates

DNS-01 challenge via Cloudflare — one certificate per site block, issued and
renewed automatically by Caddy as blocks are added or removed from the
Caddyfile. No manual cert management needed on either side.

The DNS provider itself is set once globally (`acme_dns cloudflare` in the
Caddyfile), so individual site blocks only need `import cloudflare-dns01`
for the resolver fix, not a full `tls` config each.

Registrar: [Porkbun](https://porkbun.com/account/login).
DNS host: [Cloudflare](https://dash.cloudflare.com) — nameservers were
switched at Porkbun to point to Cloudflare (Porkbun → Domain Management →
Nameservers). Cloudflare only needs API write access to create the
temporary `_acme-challenge` TXT record during issuance — no A/AAAA record
should be needed, since nothing here is meant to be reached through
Cloudflare's public DNS.

Two-domain LAN/Tailscale split per service, resolved by Pi-hole (see
[Pi-hole's README](../pihole/README.md)) — Caddy itself doesn't care which
domain a request came in on beyond routing, both just need a site block:

| Service | Local | Tailscale | Backend |
|---|---|---|---|
| Vaultwarden | `https://vaultwarden.casamia-net.top` | `https://vaultwarden.ts.casamia-net.top` | `vaultwarden:80` |
| Pi-hole | `https://pihole.casamia-net.top` | `https://pihole.ts.casamia-net.top` | `pihole:80` |
| Uptime Kuma | `https://uptime-kuma.casamia-net.top` | `https://uptime-kuma.ts.casamia-net.top` | `uptime-kuma:3001` |
| Portainer | `https://portainer.casamia-net.top` | `https://portainer.ts.casamia-net.top` | `portainer:9443` (HTTPS, self-signed) |
| Homepage (catch-all/default) | `https://casamia-net.top` and any unmatched `*.casamia-net.top` | `https://ts.casamia-net.top` and any unmatched `*.ts.casamia-net.top` | `homepage:3000` |

The catch-all block explicitly lists `ts.casamia-net.top`/`*.ts.casamia-net.top`
alongside the base domain's wildcard — a bare `*.casamia-net.top` only
matches one label deep and would not reach anything nested further, e.g.
`foo.ts.casamia-net.top`.

## Notes

### Networking

- Proxies to each backend by **container name**, not host-published port or
  LAN IP. Requires every service deployed together via the root
  `docker-compose.yml`'s `include:` directive — that's what puts everything
  on Compose's shared default network automatically.
> [!WARNING]
> Deploying a service folder standalone (`cd <service> && docker compose up -d`)
  takes it off that shared network and breaks name resolution until
  redeployed from root.
- Redeploying a single service is still fine from the root:
```bash
  docker compose up -d --force-recreate <service>
```
  Only recreates that container — doesn't touch the rest or the shared network.

### Ports

Caddy always proxies to the **container-internal** port over the shared
Docker network — never the host-published port. These are only the same
number by coincidence for some services, so worth checking each one
explicitly rather than assuming — for example:

| Service | Host-published | Container-internal (used by Caddy) |
|---|---|---|
| Pi-hole | `8081` | `80` |
| Portainer | `9443` | `9443` |

### Portainer's self-signed cert

Its proxy block uses `https://` + `tls_insecure_skip_verify` — required
because Portainer serves HTTPS internally with a self-signed cert on `9443`.
The internal hop's cert doesn't matter since it never leaves the Docker
network, but Caddy still needs to be told to accept it.

### Trust tradeoffs (deliberate, not oversights)

- **Pre-built image** (`ghcr.io/caddybuilds/caddy-cloudflare`), not a
  self-built `xcaddy` image — trusts CaddyBuilds' build pipeline in addition
  to the `caddy-dns/cloudflare` module itself.

### DNS propagation fix

`resolvers 1.1.1.1` is set per-site via the `cloudflare-dns01` snippet —
fixes a known, documented DNS-01 propagation-check failure.

## `.env`

Gitignored, lives alongside `docker-compose.yml`:

```bash
CLOUDFLARE_API_TOKEN=...   # Scoped: Edit Zone DNS, restricted to casamia-net.top only — not the legacy Global API Key
```