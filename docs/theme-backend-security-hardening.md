# Theme Backend Security Hardening

The theme settings backend is optional builder infrastructure. Phase 13 adds guardrails so it can be used as a safer local or staging service while remaining separate from the standalone CSS framework.

## Local Development

Local development mode is enabled by default unless `NODE_ENV=production`, `THEME_BACKEND_PRODUCTION_MODE=true`, or `LOCAL_DEVELOPMENT_MODE=false` is set.

In local mode:

- write routes are available without a bearer token
- local builder and static-example origins are allowed by default
- write routes are still rate limited
- JSON request bodies are size limited
- custom JS editing remains disabled unless explicitly enabled

This keeps the Phase 12 theme editor workflow usable while still exercising the same validation and storage paths.

## Production Mode

Production mode fails closed for admin API routes unless `ADMIN_API_TOKEN` is configured and requests send:

```http
Authorization: Bearer <token>
```

The backend uses an API bearer-token strategy rather than cookies, so browser writes are CSRF-aware by avoiding ambient cookie authentication. A future SloanSites admin system can replace the token resolver while keeping the same access-check boundary.

By default, production CORS has no wildcard origins. Set `ALLOWED_ORIGINS` to the exact admin app origins that should reach the API.

## Access Checks

The current access layer models:

- unauthenticated requests
- local development admin requests
- bearer-token admin requests
- denied site access

The access-check function is intentionally small and centralized so future user/site ownership can answer whether an actor can list sites, read settings, update settings, rebuild CSS, or edit custom code.

## Environment Variables

- `PORT`: server port, default `3004`
- `THEME_SETTINGS_DATA_DIR`: JSON and generated asset storage root
- `ALLOWED_ORIGINS`: comma-separated CORS allowlist
- `LOCAL_DEVELOPMENT_MODE`: explicit local-mode toggle
- `THEME_BACKEND_PRODUCTION_MODE`: explicit production-mode toggle
- `ADMIN_API_TOKEN`: production admin bearer token
- `MAX_JSON_BODY_SIZE`: Express JSON body limit, default `256kb`
- `MAX_CUSTOM_CSS_BYTES`: custom CSS limit, default `100000`
- `MAX_CUSTOM_JS_BYTES`: custom JS limit, default `50000`
- `CUSTOM_JS_EDITING_ENABLED`: custom JS edit gate, default `false`
- `CUSTOM_JS_PUBLISHING_ENABLED`: custom JS static output gate, default `false`
- `CUSTOM_HTML_BLOCKS_ENABLED`: custom HTML page block gate, default `false`
- `PUBLIC_THEME_READ_ENABLED`: generated theme metadata read gate, default `true`
- `WRITE_RATE_LIMIT_MAX`: write requests per window, default `60`
- `WRITE_RATE_LIMIT_WINDOW_MS`: write-rate window, default `60000`

Use `server/theme-settings/.env.example` as a placeholder-only reference. Do not commit real secrets.

## Validation

Write routes require `Content-Type: application/json` and reject unknown write fields. Site IDs are strict lowercase slugs of 3 to 64 characters using letters, numbers, and hyphens. Traversal, encoded traversal, slashes, backslashes, whitespace, absolute paths, and shell-sensitive punctuation are rejected before filesystem access.

Theme colors, presets, custom CSS size, custom JS size, booleans, numeric ranges, timestamps, and settings shape are validated by the backend. Browser controls are only guidance; backend validation is the source of truth.

## Custom CSS And JS

Custom CSS remains allowed with a configurable size limit and is stored as `custom.css` under the site folder. It is never merged into `src/ss.css` or `dist/ss.css`.

Custom JS is treated as risky. Editing is disabled by default, requires admin access, and is stored separately as `custom.js`. The theme editor does not execute saved JS. Future public publishing should only include custom JS when the site enables it and backend configuration explicitly allows it.

## Audit Logs

Audit entries are written as JSON lines to:

```text
server/theme-settings/data/audit/audit.log
```

Logged events include site creation, settings reads and updates, theme rebuilds, custom CSS/JS updates, validation failures, auth/access failures, rate-limit failures, and settings backup creation. Logs include metadata such as timestamp, actor, action, site ID, result, and status. They do not log secrets or full custom code content.

## Backups And Restore

Before replacing `settings.json`, the backend writes a timestamped backup under the site folder and the shared data backup folder. Site-level backups retain the newest 10 settings backups.

Manual restore is the supported path in this phase:

1. Stop the backend.
2. Copy the desired backup over `data/sites/<site-id>/settings.json`.
3. Restart the backend.
4. Rebuild `theme.css`.

No restore API is exposed yet. If one is added later, it should require stricter authorization than normal settings writes and emit restore audit events.

## Still Required Before Public Exposure

Before public deployment, connect the access layer to real SloanSites admin authentication, use HTTPS, configure exact origins, store secrets outside the repo, put logs under retention policy, consider reverse-proxy rate limiting, add CSRF/session rules if cookie auth is introduced, and use a strict Content Security Policy for any custom-code preview or publishing.
