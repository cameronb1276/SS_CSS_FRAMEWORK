# Static Publish Output

Phase 15 adds a local static publish pipeline for JSON-backed SloanSites pages. It turns site settings, generated theme CSS, custom CSS, and page JSON into inspectable static HTML output.

This does not deploy to a real server. It creates a local preview folder that can later feed a hosting pipeline.

## Output Layout

Published output is written under:

```text
server/theme-settings/data/published/<site-id>/
  index.html
  publish.json
  css/
    ss.css
    theme.css
    custom.css
  js/
    custom.js
  assets/
```

Only files needed for the static preview are copied. Runtime published output is ignored by Git.

## Publish Route

Use:

```bash
curl -X POST http://localhost:3004/api/sites/demo-site/publish \
  -H "Content-Type: application/json" \
  -d "{\"includeDrafts\":false,\"allowCustomJs\":false}"
```

Read the latest metadata:

```bash
curl http://localhost:3004/api/sites/demo-site/publish
```

Preview locally:

```text
http://localhost:3004/preview/demo-site/index.html
```

## CSS Load Order

Generated pages load CSS in this order:

1. `css/ss.css`
2. `css/theme.css`
3. `css/custom.css`, only when enabled and non-empty

The pipeline never rewrites `dist/ss.css` for one site.

## HTML Generation

The renderer supports the first builder block set:

- headings
- text
- buttons
- images
- cards
- lists
- form placeholders
- map placeholders
- business hours
- testimonials

Generated markup uses normal published-site classes such as `.ss-site`, `.ss-site-page`, `.ss-published`, `.ss-section`, `.ss-card`, and local-business helpers.

Builder app UI and active editing artifacts are not included in generated HTML.

## Draft And Published Pages

By default, publish output includes only pages with `status: "published"`.

Set `includeDrafts: true` for a local preview build that includes draft pages. The returned metadata marks this as `mode: "preview"`.

## Validation

Before output is generated, the backend validates:

- site ID
- site settings
- content index
- page files
- default page
- page slugs
- duplicate output paths
- page schema
- section and block schema
- custom CSS state
- custom JS inclusion rules
- asset references

Missing pages, invalid slugs, duplicate paths, unsafe assets, or corrupt page JSON stop the publish.

## Custom CSS

When custom CSS is enabled and non-empty, it is copied to `css/custom.css` and linked after generated theme CSS. It remains separate from the framework CSS.

## Custom JS

Custom JS is excluded by default. It is included only when all of these are true:

- the site has custom JS enabled
- the publish request sets `allowCustomJs: true`
- backend configuration sets `CUSTOM_JS_PUBLISHING_ENABLED=true`
- the saved custom JS passes validation

The publish generator writes custom JS as a file but does not execute it.

## Assets

Page media can reference `https://` URLs or safe site-relative `assets/` paths. Relative asset paths are copied only from the site's own `assets` folder. Traversal and unsupported paths are rejected.

Asset management is intentionally minimal in this phase.

## Known Limits

The renderer is deliberately small. It is meant to prove the storage-to-static-output path, not replace a full templating system. Future hosting work should add deployment targets, cache headers, image processing, sitemap generation, redirects, analytics configuration, and production CSP rules.
