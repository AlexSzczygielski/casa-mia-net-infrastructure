# Flights - excel

Internal, private service.

## Access

- LAN:
  ```
  https://flights.casamia-net.top
  ```
- Tailscale:
  ```
  https://flights.ts.casamia-net.top
  ```

No host port is published — reachable only through Caddy on the shared Compose network, not directly by IP.

For now requires manual html update:

```
scp index.html  user@<IP>:/opt/docker-data/flights-excel/site/index.html
```