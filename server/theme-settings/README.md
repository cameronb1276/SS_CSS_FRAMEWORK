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
- `ALLOWED_ORIGINS`: comma-separated CORS allowlist. Defaults to local development origins for the builder app, backend, static example servers on ports `8080` and `8095`, and direct local file examples.
- `REQUEST_LOGGING`: set to `false` to silence request logs.

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
curl -X POST http://localhost:3004/api/sites/demo-site/rebuild-theme
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
  theme.css
  custom.css
  custom.js
  backups/
```

`settings.json` is the editable source of truth. `theme.css` is generated output. `custom.css` and `custom.js` are separate files and are never merged into `dist/ss.css`.

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

Do not store page content in theme settings. Page content should remain in a separate future content system.

## Theme CSS Generation

Generated CSS is scoped to:

```css
[data-ss-site-theme="demo-site"], .ss-site-theme-demo-site
```

The generator maps validated settings into SS CSS variables such as brand colors, page gutter, radius, shadows, font stacks, section spacing, and button shape. It does not duplicate the whole framework and does not modify `dist/ss.css`.

## Validation And Safety

Site IDs are treated as untrusted input. They must be lowercase slug values containing only letters, numbers, and hyphens. Path traversal, encoded traversal, spaces, slashes, backslashes, shell-like punctuation, and suspicious values are rejected before filesystem access.

Color values accept hex colors and safe `rgba()` values only. CSS expressions, URLs, JavaScript-like content, overly long values, and unsafe characters are rejected.

Custom CSS is limited to 100 KB. Custom JS is limited to 50 KB, disabled by default, stored as text, and never executed by the server.

Before `settings.json` is replaced, the current version is backed up and the new JSON is written through a temporary file.

## Verification

Run:

```bash
npm run verify
```

The verification script builds the backend, starts a temporary server, checks health, creates a site, reads settings, accepts a valid theme update, rejects an invalid color, rejects a traversal site ID, rebuilds `theme.css`, and stores custom JS without executing it.

Manual health check:

```bash
curl http://localhost:3004/api/health
```

## Production Note

This phase does not implement authentication. Do not expose this backend publicly without authentication, authorization, HTTPS, logging, rate limiting, and reverse-proxy controls.

## Future Work

Future phases may add a builder theme panel UI, live preview JavaScript, authentication, role-based access, publish pipeline, reusable theme marketplace, database-backed site registry, audit logs, and settings restore UI.
