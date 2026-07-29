# Pi-hole

Network-wide DNS sinkhole — blocks ads and trackers by refusing to resolve known ad/tracker domains for every device that uses it as a DNS server.

[Pi-hole Docs](https://docs.pi-hole.net)

## Access

- DNS: `192.168.0.136:53`
- Web UI: [http://192.168.0.136:8081/admin](http://192.168.0.136:8081/admin)

## Notes

- Web UI is bound to host port `8081`, not the default `80/443` — those are reserved for Nginx Proxy Manager. Pi-hole's own HTTPS (443) is unused here.
- `FTLCONF_dns_listeningMode: ALL` is required — without it, Pi-hole ignores DNS queries arriving via Docker's bridge network port mapping, since they don't look like they're coming from a directly-attached interface.
- Privacy level is set to **3 (Anonymous mode)** — Pi-hole does not log which domains or clients made which queries, only aggregate/anonymous stats. Blocking is unaffected by this; it only controls history/statistics storage.
- Only Pi-hole's single default blocklist is active. No additional lists (e.g. from firebog.net) have been added yet.
- Client devices are configured with Pi-hole as their **only** DNS server (no fallback resolver above or below it) — if Pi-hole goes down, DNS resolution fails outright for those devices rather than silently falling back and losing ad-blocking. [**current setup, where router cant be pointed at DNS, concerns only devices with manually overridden DNS setting from 192.168.0.1 to 192.168.0.136**]
- Password set via `.env` (`PIHOLE_PASSWORD`), gitignored, per repo convention.