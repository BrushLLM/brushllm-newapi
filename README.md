<div align="center">

![BrushLLM](/web/public/logo.png)

# BrushLLM Console

**One key for every model.**

An enterprise AI gateway: OpenAI, Anthropic, Gemini, DeepSeek, Qwen and other
major model services behind a unified API, unified billing, and unified auditing.

[Website](https://brushllm.com) · [Docs](https://brushllm.com/docs) · [1Panel App Store](https://github.com/BrushLLM/brushllm-appstore)

</div>

---

## About

BrushLLM Console is a branded deployment of the open-source
[New API](https://github.com/QuantumNous/new-api) gateway (AGPLv3), customized
for brushllm.com:

- **BrushLLM theme** — violet/mint brand palette, Inter + Space Grotesk
  typography, signature brush-band highlights, light & dark
- **Split-screen sign-in** as the public homepage, with in-page language
  switching (11 locales: English, Deutsch, Español, Français, Português,
  日本語， 简体中文， 繁體中文， 한국어， Русский， Tiếng Việt)
- **Region-aware language detection** — `de-DE`, `pt-BR`, `zh-Hant-*` browser
  locales resolve correctly instead of falling back to English
- Version numbers track upstream releases (currently `v1.0.0-rc.47`) to keep
  future upstream merges and security updates straightforward

## Quick start

### Docker

```bash
docker run -d --name brushllm \
  -p 3000:3000 \
  -v $(pwd)/data:/data \
  ghcr.io/brushllm/brushllm-newapi:latest
```

Open `http://localhost:3000` and complete the setup wizard. SQLite works out
of the box; set `SQL_DSN` for MySQL/PostgreSQL and `REDIS_CONN_STRING` for
Redis when scaling out.

### 1Panel

Install from the [BrushLLM app store](https://github.com/BrushLLM/brushllm-appstore)
with one command, then manage upgrades from the panel:

```bash
bash <(curl -sL https://github.com/BrushLLM/brushllm-appstore/raw/main/install.sh)
```

### From source

```bash
cd web && bun install --frozen-lockfile && bun run build && cd ..
go run .
```

## Configuration

| Variable | Default | Description |
|---|---|---|
| `SQL_DSN` | SQLite | MySQL/PostgreSQL connection string |
| `REDIS_CONN_STRING` | none | Redis connection string (recommended for multi-node) |
| `SESSION_SECRET` | random | Persistent auth secret; must match across nodes |
| `LOG_SQL_DSN` | main DB | Separate log database (MySQL/PostgreSQL/ClickHouse) |
| `TZ` | system | Timezone, e.g. `Asia/Shanghai` |

See [`.env.example`](.env.example) and the upstream documentation for the
full list.

## License & attribution

This program is free software licensed under the
[GNU Affero General Public License v3.0](LICENSE).

Frontend design and development by the New API contributors —
https://github.com/QuantumNous/new-api

Based on [One API](https://github.com/songquanpeng/one-api) (MIT License).
See [NOTICE](NOTICE) and [THIRD-PARTY-LICENSES.md](THIRD-PARTY-LICENSES.md)
for attribution and dependency notices.
