# Open WebUI
**Currently not deployed** — pulled out of the root `docker-compose.yml` alongside Ollama for restructuring; the notes below describe the last working setup. Its Caddyfile blocks are still present but currently dangling (no container to resolve to) — see [Caddy's README](https://github.com/AlexSzczygielski/casa-mia-net-infrastructure/blob/main/caddy/README.md).

Browser-based chat interface for Ollama — model picker, chat history, per-model tool/capability config. The only client currently talking to Ollama.

[Open WebUI Docs](https://docs.openwebui.com)

## Access

- LAN:
  ```
  https://open-webui.casamia-net.top
  ```
- Tailscale:
  ```
  https://open-webui.ts.casamia-net.top
  ```

## Notes

- Runs as root — nothing to pre-create, Docker auto-creates `/opt/docker-data/open-webui` on first start.
- Reaches Ollama via `OLLAMA_BASE_URL=http://ollama:11434` — container-name resolution, only works when both are deployed together from the root compose (per repo convention: always deploy from root).
- `AIOHTTP_CLIENT_TIMEOUT=600` — raised from the default because prompt processing on this hardware is slow enough to exceed a short timeout on the first message of a chat, cutting the reply before it finishes.
- **Builtin Tools default to fully enabled per-model** (Notes, Memory, Web Search, Chat History, Calendar, etc. — 15 total) and inject their schemas into every prompt regardless of whether they're used, adding ~2000 tokens of fixed overhead and confusing small models into fabricating tool calls. Disable all of them (Admin Panel → Settings → Models → select model → Model Capabilities → Builtin Tools) for a model used for plain chat; re-enable individually only when specifically testing that tool.
- **Title/Tag/Follow-up Auto-Generation** (Settings → Interface → Chat) each fire a background LLM call after every message, re-sending the full conversation as context — disabled here to avoid doubling load on already-slow hardware.
- An unused OpenAI-compatible connection (Admin Panel → Settings → Connections) was left misconfigured, causing a background 500 error on every page load (harmless, but noisy in the browser console) — remove any connection entry not actually in use.
- WebSocket (`wss://.../ws/socket.io`) currently fails to connect over the Tailscale domain — likely a Caddy config gap for WS upgrade headers on that route. Not yet fixed; doesn't block chat, may affect live status/streaming polish.