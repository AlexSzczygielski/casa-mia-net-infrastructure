# Ollama
**Currently not deployed** — pulled out of the root `docker-compose.yml` for restructuring; the notes below describe the last working setup.

Local LLM inference server — runs quantized language models (Llama, Qwen, etc.) for testing, with no data leaving the homelab. Backs Open WebUI as its only client.

[Ollama Docs](https://docs.ollama.com)

## Access

Container-internal only — `http://ollama:11434`, reachable from other containers on the shared Compose network (currently just Open WebUI). Not exposed via Caddy or published to the host: the API has no browser UI of its own, so there's nothing to visit directly. If a future use case needs raw API access (e.g. a script or IDE plugin), add a `ollama.ts.casamia-net.top` Caddy block over Tailscale rather than LAN.

## Notes

- Runs as root — image doesn't support non-root operation cleanly; nothing to pre-create, Docker auto-creates `/opt/docker-data/ollama` on first start.
- **CPU type matters.** The Proxmox VM's default CPU type (`x86-64-v2-AES`) doesn't expose AVX2 to the guest, even though the host CPU (i5-4590T, Haswell) supports it. Without AVX2, prompt processing runs ~5x slower. Fixed by setting the VM's CPU type to `host` in Proxmox (Hardware → Processors → Type), which requires a full VM shutdown/start (not just a guest reboot) to take effect. Safe here since this is a single-node setup with no live-migration needs.
- **CPU-only, no GPU** — this hardware has no PCIe slot. Realistic model ceiling is ~3B parameters; even then, expect single-digit tokens/sec on generation. Verified working: `llama3.2:1b`, `llama3.2:3b`.
- **RAM is tight** (~6GB VM total, shared with the rest of the stack) — running a 3B model alongside the full service list can push into swap. Prefer `llama3.2:1b` when other services are up; drop to 3B only for isolated testing.
- Models are pulled via CLI, not the Open WebUI GUI, to keep model state declarative/scriptable:
```bash
  docker exec -it ollama ollama pull llama3.2:1b
  docker exec -it ollama ollama list
  docker exec -it ollama ollama ps      # currently loaded models
```
- Open WebUI's **Builtin Tools** (Notes, Web Search, Memory, etc.) inject their full schema into every prompt when enabled on a model — easily 2000+ tokens of fixed overhead before the actual message. Keep them off for a model used for plain chat/testing; enable only the specific tool being tested, one at a time.