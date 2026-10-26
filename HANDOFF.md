# BrushLLM Console — AI Handoff Document

> This document is written for AI agents (or humans) taking over this project.
> It records everything that was customized, why, how it was verified, and
> what remains to be done. Read this before making changes.

## 1. What this project is

**BrushLLM Console** is a branded fork of
[QuantumNous/new-api](https://github.com/QuantumNous/new-api) (AGPLv3) — an
AI gateway ("one key for every model") customized for brushllm.com.

- **Source repo**: https://github.com/BrushLLM/brushllm-newapi (public)
  - Local path: the `new-api/` directory in the original workspace
  - Base: upstream `main` @ `9823ebc7e`, version aligned to `v1.0.0-rc.47`
  - Full upstream history preserved (6619+ commits) for future merges
- **1Panel app store repo**: https://github.com/BrushLLM/brushllm-appstore (public)
- **Image**: `ghcr.io/brushllm/brushllm-newapi` (built by GitHub Actions on `v*` tags)
- **Brand source**: brushllm.com (violet `#893ced`, mint `#2aefc8`, yellow
  `#f4ea2a`, ink `#1a1b25`, Inter + Space Grotesk, brush-band highlight)

Design decisions were approved by the owner through 4 demo iterations
(v1 classic → v2 dark canvas → v3 bright → **v4 final = v2 login + v1 console**).

## 2. Commit map (our 6 commits on top of upstream)

| Commit | Content |
|---|---|
| `feat(theme)` | brushllm theme preset, fonts, default preset lock |
| `feat(brand)` | rebrand + AGPL attribution + version v1.0.0-rc.47 |
| `feat(i18n)` | de/es/ptBR/ko locales + region-aware detection |
| `feat(console)` | split-screen sign-in, home retirement, image CI |
| `docs` ×2 | English README rewrite; repo-rename reference fix |

## 3. Customization details (file-level)

### 3.1 Theme (web/src/styles/)
- `theme-presets.css`: `[data-theme-preset='brushllm']` light + dark blocks
  (~90 CSS vars). **Opted out** of the semantic surface bridge (added
  `:not([data-theme-preset='brushllm'])` to both bridge selectors) to keep
  amber warning semantics. Headings/title slots get Space Grotesk via
  `--font-display` rules inside the preset block.
- `theme.css`: `--font-display` token in `@theme inline`.
- `index.css`: `.brush-band` / `.brush-band-mint` signature classes
  (hand-drawn highlight SVG from brushllm.com).
- **Fonts are imported in `main.tsx` (JS side), NOT in CSS** — CSS-side
  `@import` of fontsource packages hangs vitest's CSS pipeline (verified).
- `lib/theme-customization.ts`: brushllm preset registered first; default
  preset = `brushllm`.
- `context/theme-customization-provider.tsx`: attribute logic changed to
  `preset === 'default' ? null : preset` — every named preset (incl. the
  new default brushllm) MUST set `data-theme-preset`, otherwise the preset
  CSS never applies.

### 3.2 Branding
- Go: `common/constants.go` (SystemName="BrushLLM", Version="v1.0.0-rc.47"),
  `common/init.go` (banner), `main.go` (panic message), 
  `setting/operation_setting/general_setting.go` (DocsLink → brushllm.com/docs)
- Web: `lib/constants.ts`, `index.html`, `public/logo.png` (256px, 30KB),
  `public/favicon.ico`, `footer.tsx`, `about/index.tsx`, `system-brand.tsx`,
  settings placeholders, `chat-links.ts`, `assets/logo.tsx`
- **AGPL compliance (Plan A, owner-approved)**: footer `ProjectAttribution`
  hardcodes the "New API" link label (NOT the localized `t('New API')` key,
  to survive brand replacement) + localized suffix key
  `footer.newapi.projectAttributionSuffix`; the about page carries the full
  legal notice block in English. Do not remove these.
- Locale brand replacement was applied to the 7 pre-existing locales
  (values only, keys untouched; `footer.*` attribution keys exempt).

### 3.3 i18n (11 locales)
- Order in `INTERFACE_LANGUAGE_OPTIONS` (languages.ts): en, de, es, fr, ptBR,
  ja, zhCN, zhTW, ko, ru, vi — **owner-specified order**, ru/vi after Korean.
- 4 new locales (de/es/ptBR/ko), 7369 keys each, translated by subagents with
  strict rules (placeholders `{{x}}`, HTML entities, URLs preserved; brand
  "New API"→"BrushLLM" except footer/attribution keys). Key parity with en
  validated; `bun run i18n:sync` reports 0 missing.
- `convertDetectedLanguage`: strips region subtags (de-DE→de) and maps all
  `pt-*`→ptBR. This fixes an upstream latent bug: `load:'currentOnly'` only
  matches exact codes, so regional browser locales fell back to English.
- `toIntlLocale`: ptBR → pt-BR.

### 3.4 Auth / routing
- `features/auth/auth-layout.tsx` rewritten: split-screen (ink brand canvas
  + form side), in-page `LanguageSwitcher` (top-right, 🌍 icon), AGPL
  attribution line at bottom. Brand copy via `auth.brand.*` i18n keys
  (9 keys, all 11 locales).
- `routes/index.tsx`: `/` redirects auth-aware (members→/dashboard,
  visitors→/sign-in). The marketing home (`features/home`) is retired but
  its files remain (unreferenced, excluded from route bundle).
- `hooks/use-top-nav-links.ts`: Home link only for anonymous users (was a
  dead click for members). `system-brand.tsx` links to `/dashboard`.

### 3.5 CI / Docker
- `.github/workflows/docker-image.yml`: multi-arch (amd64/arm64) build →
  `ghcr.io/brushllm/brushllm-newapi` on `v*` tags + latest. Image name
  follows `github.repository` automatically — **if the repo is renamed
  again, the image name changes; update the appstore compose files too**.
- `Dockerfile`: optional `ARG GOPROXY` (default proxy.golang.org) — local
  builds in CN networks need `--build-arg GOPROXY=https://goproxy.cn,direct`.

## 4. 1Panel app store (brushllm-appstore repo)

Format: official data.yml app package (v1.3+/v2). Structure:
`apps/brushllm/{data.yml, logo.png, README.md, README_en.md, 1.0.0-rc.47/, latest/}`.
Each version dir: `data.yml` (formFields), `docker-compose.yml`,
`data/.gitkeep`, `logs/.gitkeep`.

- Compose follows the hard rules: `container_name: ${CONTAINER_NAME}`,
  external `1panel-network`, `labels: createdBy: "Apps"`, every `${VAR}`
  declared in formFields, healthcheck `wget /api/status` (image ships wget).
- Form fields: PANEL_APP_PORT_HTTP (3000), TZ, SESSION_SECRET (random),
  SQL_DSN (optional, empty=SQLite), REDIS_CONN_STRING (optional).
- Install: `install.sh` clones the repo → copies `apps/*` to
  `$PANEL_BASE_DIR/1panel/resource/apps/local/` → user clicks "Sync Local
  Apps" in the panel. Upgrades: re-run script → sync → "Upgradable".
- Validated with the official `validate_app_package.py` (passes; the only
  warning is the intentional `:latest` floating tag in the latest/ variant).
- Note: app-level README.md is English-only per owner decision ("all GitHub
  content in English"); the official style guide expects `## 产品介绍` in
  README.md — the validator flags this, but the panel itself does not care.

## 5. Verification already performed

- typecheck (1405 files, 0 errors), `bun run build`, Go build: all pass
- Full vitest: 2427/2429 — the 2 failures (detail-preview, visual-billing)
  are **upstream flaky** (hang on pristine HEAD ~40% of runs; race in
  `act(() => i18n.changeLanguage())`), not caused by our changes
- Real-app screenshots (demo/shots/): sign-in light/dark, console light/dark,
  language switcher (11 langs, correct order), 4 new languages rendering
- Flow tests: guest guard, registration, login, logged-in bounce, logout —
  all pass (backend rate limit `CriticalRateLimit` 20/20min can 429 rapid
  automated logins; test with `CRITICAL_RATE_LIMIT_ENABLE=false`)
- Docker simulation: image built, compose up, `/api/status` returns
  BrushLLM/v1.0.0-rc.47, healthcheck healthy, SQLite in ./data, upgrade
  preserves data

## 6. Known issues / decisions to remember

1. **Repo renamed** brushllm-console → brushllm-newapi by the owner; all
   references updated. If renamed again: update appstore compose image,
   appstore README/data.yml github field, source README.
2. **ghcr package visibility**: repo went public AFTER creation; the first
   Actions push creates the package — check its visibility is public.
3. **First image build not yet triggered** — push tag `v1.0.0-rc.47` to
   brushllm-newapi to build `ghcr.io/brushllm/brushllm-newapi:v1.0.0-rc.47`.
4. Locale lazy-loading NOT implemented (11 locales ≈ 6.7MB static import in
   the entry chunk) — accepted trade-off, matches upstream architecture.
5. Channel-protocol strings mentioning "New API" (channel type 60,
   `NewAPIError`, static-keys.ts) are intentionally kept — protocol naming.
6. The `latest/` appstore variant intentionally uses a floating tag.
7. Local dev servers: backend `go run .` (port 3000), frontend
   `bun run dev --port 5173` (web/). Test admin: admin/admin123456 (local
   SQLite only, never committed).

## 7. Upgrading from upstream (future)

1. `git fetch upstream && git merge upstream/main` — conflicts expected in:
   `theme-presets.css`, `languages.ts`, `footer.tsx`, `auth-layout.tsx`,
   locale JSONs.
2. Bump `VERSION` + `common/constants.go` Version to the new upstream release.
3. Translate any NEW i18n keys for de/es/ptBR/ko (en/zh first, then the 4).
4. Add a new version directory in brushllm-appstore (`apps/brushllm/<ver>/`,
   no `v` prefix) with compose pinning the new image tag.
5. Push tag `v<version>` → CI builds image → users re-run install.sh →
   panel shows "Upgradable".

## 8. Environment / tooling notes

- Bun + Go required (owner has them). Frontend tests: `bun run test`.
- i18n sync after locale edits: `bun run i18n:sync` (report in
  `src/i18n/locales/_reports/_sync-report.json`).
- The brushllm_studio GitHub MCP (ZCode config) holds the PAT for the
  BrushLLM account — used for repo creation/pushes. Git pushes were done
  with one-shot token URLs (never stored in git config).
