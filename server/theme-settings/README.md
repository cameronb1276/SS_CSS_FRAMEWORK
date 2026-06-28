# SS Theme Settings Backend

This optional backend supports the SloanSites website-builder workflow. It does not replace SS CSS Framework. It stores per-site theme settings in local JSON files and generates a scoped `theme.css` file that a published site can load after the base framework CSS.

Default port: `3004`

## How It Fits

SS CSS remains a standalone CSS framework. The backend is an optional local service for builder workflows that need to:

- Create a site storage folder.
- Create and read `settings.json`.
- Validate and update theme settings.
- Preserve settings backups before replacement.
- Generate scoped `theme.css`.
- Store custom CSS and custom JS separately from the framework.

Published pages should load files in this order:

```html
<link rel="stylesheet" href="/dist/ss.css">
<link rel="stylesheet" href="/sites/example-site/theme.css">
```

The published wrapper can then use:

```html
<body class="ss-page ss-site ss-published ss-client-theme" data-ss-site-theme="example-site">
```

## Install And Run

From this folder:

```bash
npm install
npm run dev
```

Production-style local run:

```bash
npm run build
npm start
```

Environment variables:

- `PORT`: server port, defaults to `3004`.
- `THEME_SETTINGS_DATA_DIR`: storage root, defaults to `server/theme-settings/data`.
- `ALLOWED_ORIGINS`: comma-separated CORS allowlist. Defaults to local development origins for the builder app, backend, static example servers on ports `8080` and `8095`, and direct local file examples. Production mode defaults to no browser origins.
- `LOCAL_DEVELOPMENT_MODE`: set `false` to require production-style auth checks.
- `THEME_BACKEND_PRODUCTION_MODE`: set `true` to fail closed for admin routes without `ADMIN_API_TOKEN`.
- `ADMIN_API_TOKEN`: bearer token for production admin API requests. Never commit a real value.
- `MAX_JSON_BODY_SIZE`: JSON body limit, defaults to `256kb`.
- `MAX_CUSTOM_CSS_BYTES`: custom CSS byte limit, defaults to `100000`.
- `MAX_CUSTOM_JS_BYTES`: custom JS byte limit, defaults to `50000`.
- `CUSTOM_JS_EDITING_ENABLED`: set `true` to allow admin custom JS edits. Defaults to `false`.
- `CUSTOM_HTML_BLOCKS_ENABLED`: set `true` to allow advanced custom HTML page blocks. Defaults to `false`.
- `PUBLIC_THEME_READ_ENABLED`: set `false` to require auth for generated theme metadata reads.
- `WRITE_RATE_LIMIT_MAX`: write requests per window, defaults to `60`.
- `WRITE_RATE_LIMIT_WINDOW_MS`: write-rate window, defaults to `60000`.
- `REQUEST_LOGGING`: set to `false` to silence request logs.

See `.env.example` for placeholder-only configuration.

## API Routes

All admin routes live under `/api`.

- `GET /api/health`
- `GET /api/sites`
- `POST /api/sites`
- `GET /api/sites/:siteId/settings`
- `PUT /api/sites/:siteId/settings`
- `POST /api/sites/:siteId/rebuild-theme`
- `GET /api/sites/:siteId/theme`
- `GET /api/sites/:siteId/custom-css`
- `PUT /api/sites/:siteId/custom-css`
- `GET /api/sites/:siteId/custom-js`
- `PUT /api/sites/:siteId/custom-js`
- `GET /api/sites/:siteId/pages`
- `POST /api/sites/:siteId/pages`
- `POST /api/sites/:siteId/pages/validate`
- `GET /api/sites/:siteId/pages/:pageId`
- `PUT /api/sites/:siteId/pages/:pageId`

Example create request:

```bash
curl -X POST http://localhost:3004/api/sites \
  -H "Content-Type: application/json" \
  -d "{\"siteId\":\"demo-site\",\"siteName\":\"Demo Site\",\"themeName\":\"Demo Theme\"}"
```

Example update request:

```bash
curl -X PUT http://localhost:3004/api/sites/demo-site/settings \
  -H "Content-Type: application/json" \
  -d "{\"theme\":{\"light\":{\"primary\":\"#0ea5e9\",\"focus\":\"#0ea5e9\"}}}"
```

Rebuild generated CSS:

```bash
curl -X POST http://localhost:3004/api/sites/demo-site/rebuild-theme \
  -H "Content-Type: application/json" \
  -d "{}"
```

Production write requests must include:

```bash
curl -X PUT http://localhost:3004/api/sites/demo-site/settings \
  -H "Authorization: Bearer $ADMIN_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"theme\":{\"light\":{\"primary\":\"#0ea5e9\"}}}"
```

## Theme Editor Example

The framework includes a reference builder theme editor at:

```text
../../examples/theme-editor.html
```

Run this backend on port `3004`, then open the example in a browser. The editor loads a site list, creates `theme-editor-demo` if needed, previews theme changes by applying scoped SS CSS variables, saves settings through the API, saves custom CSS separately, and triggers `theme.css` rebuilds.

The editor does not execute custom JS. Custom JS editing is disabled by default and is expected to be further restricted by production auth and configuration.

## Storage Model

Each site is stored under:

```text
data/sites/<site-id>/
  settings.json
  site-content.json
  theme.css
  custom.css
  custom.js
  pages/
  backups/
```

`settings.json` is the editable theme source of truth. `site-content.json` stores page order and default page metadata. `pages/*.json` stores editable page content. `theme.css` is generated output. `custom.css` and `custom.js` are separate files and are never merged into `dist/ss.css`.

Runtime site files are ignored by Git. The `.gitkeep` files only preserve empty storage folders.

## Settings Model

Default settings include:

- `schemaVersion`
- `site`
- `theme`
- `layout`
- `typography`
- `buttons`
- `sections`
- `builder`
- `published`
- `customCode`
- `timestamps`

Do not store page content in theme settings. Page content belongs in `pages/*.json`.

## Page Content Model

New sites receive a default published `home` page. Page JSON supports page title, slug, SEO fields, draft/published status, navigation metadata, sections, blocks, and custom metadata.

Supported section types are `hero`, `services`, `about`, `pricing`, `testimonials`, `faq`, `gallery`, `contact`, `cta`, `footer`, and `custom`.

Supported block types are `heading`, `text`, `button`, `image`, `card`, `list`, `form-placeholder`, `map-placeholder`, `business-hours`, `testimonial`, and advanced `custom-html`. Custom HTML blocks are disabled by default.

Before replacing a page JSON file, the backend writes a timestamped backup to `data/sites/<site-id>/backups/pages/` and keeps the newest 10 backups per page.

See `../../docs/site-content-json-model.md`.

## Theme CSS Generation

Generated CSS is scoped to:

```css
[data-ss-site-theme="demo-site"], .ss-site-theme-demo-site
```

The generator maps validated settings into SS CSS variables such as brand colors, page gutter, radius, shadows, font stacks, section spacing, and button shape. It does not duplicate the whole framework and does not modify `dist/ss.css`.

## Validation And Safety

Site IDs are treated as untrusted input. They must be lowercase slug values containing only letters, numbers, and hyphens. Path traversal, encoded traversal, spaces, slashes, backslashes, shell-like punctuation, and suspicious values are rejected before filesystem access.

Color values accept hex colors and safe `rgba()` values only. CSS expressions, URLs, JavaScript-like content, overly long values, and unsafe characters are rejected.

Write routes require `Content-Type: application/json`, reject unsupported fields, and are rate limited. In local development mode, admin routes are open to support the builder workflow. In production mode, admin routes require a bearer token and fail closed if `ADMIN_API_TOKEN` is not configured.

Custom CSS is limited to 100 KB by default. Custom JS is limited to 50 KB by default, editing is disabled unless `CUSTOM_JS_EDITING_ENABLED=true`, stored as text, and never executed by the server.

Before `settings.json` is replaced, the current version is backed up and the new JSON is written through a temporary file.

Audit logs are written as JSON lines to `data/audit/audit.log`. They include operation metadata but do not log secrets or full custom code content.

Manual restore is the supported backup path in this phase: stop the backend, copy a timestamped backup over `data/sites/<site-id>/settings.json`, restart, and rebuild `theme.css`.

## Verification

Run:

```bash
npm run verify
```

The verification script builds the backend, starts temporary servers, checks health, creates a site, reads settings, verifies default page creation, lists/reads/updates page JSON, rejects invalid page slugs and duplicate IDs, checks page backups, accepts a valid theme update, rejects invalid colors and unsafe IDs, rejects unknown presets, rejects oversized custom CSS, verifies custom JS is disabled by default, rebuilds `theme.css`, checks audit logs, checks production fail-closed behavior, and checks write rate limiting.

Manual health check:

```bash
curl http://localhost:3004/api/health
```

## Production Note

Phase 13 adds a bearer-token admin boundary and access-check structure, but a real SloanSites production deployment should still connect this layer to the main admin auth system, run behind HTTPS, configure exact origins, store secrets outside the repo, monitor audit logs, and use reverse-proxy protections.

## Future Work

Future phases may connect the auth boundary to real SloanSites users and site ownership, add role-based access, publish pipeline, reusable theme marketplace, database-backed site registry, custom-code sandboxing, and settings restore UI.
