# Site Content JSON Model

Phase 14 adds an optional JSON content model for SloanSites builder workflows. It stores website content separately from theme settings and separately from the CSS framework.

The base framework still works by linking `dist/ss.css`; no site JSON is required for normal CSS usage.

## Storage Layout

Each site folder can contain:

```text
data/sites/<site-id>/
  settings.json
  site-content.json
  theme.css
  custom.css
  custom.js
  pages/
    home.json
    services.json
  backups/
    settings.<timestamp>.json
    pages/
      home.<timestamp>.json
```

`settings.json` stores theme and builder settings. `site-content.json` stores content metadata such as default page ID and page order. Each page is stored as one JSON file in `pages/`.

## Site Content Index

`site-content.json` contains:

- `schemaVersion`
- `siteId`
- `defaultPageId`
- `pageOrder`
- `publishedStatus`
- `createdAt`
- `updatedAt`

This index is intentionally small. A future database can migrate it into a site table or navigation table without changing the page JSON contract.

## Page Model

Each page JSON file contains:

- `schemaVersion`
- `pageId`
- `title`
- `slug`
- `seo.title`
- `seo.description`
- `status`, either `draft` or `published`
- `createdAt`
- `updatedAt`
- `navigation.label`
- `navigation.order`
- `navigation.showInNavigation`
- `sectionOrder`
- `sections`
- `metadata`

The default starter site creates a published `home` page with hero, services, and contact sections.

## Section Model

Sections map to existing SS CSS section concepts. Supported section types are:

```text
hero, services, about, pricing, testimonials, faq, gallery, contact, cta, footer, custom
```

Each section includes an ID, display name, lock/hidden flags, style preset, layout preset, spacing preset, background setting, block order, and blocks array.

## Block Model

Supported block types are:

```text
heading, text, button, image, card, list, form-placeholder, map-placeholder, business-hours, testimonial, custom-html
```

Blocks include ID, label, content fields, hidden/locked flags, validation status, style options, optional link settings, and optional media references.

`custom-html` is advanced and disabled by default. Non-custom blocks reject raw `html` content fields.

## Safe IDs And Slugs

Site IDs, page IDs, section IDs, block IDs, and page slugs use strict lowercase slug-style values. The backend rejects traversal, encoded traversal, absolute paths, slashes, backslashes, control characters, whitespace, unsafe punctuation, overly long values, and references that escape the expected storage folder.

## API Routes

The backend adds these routes:

- `GET /api/sites/:siteId/pages`
- `POST /api/sites/:siteId/pages`
- `POST /api/sites/:siteId/pages/validate`
- `GET /api/sites/:siteId/pages/:pageId`
- `PUT /api/sites/:siteId/pages/:pageId`

Create and update routes expect full page JSON documents. The validate route returns `{ valid: true, page, errors: [] }` or `{ valid: false, errors }` without saving.

## Backups

Before replacing a page JSON file, the backend writes a timestamped backup to:

```text
data/sites/<site-id>/backups/pages/<page-id>.<timestamp>.json
```

The newest 10 backups per page are retained. Manual restore is currently supported by stopping the backend, copying the desired backup over the page file, and restarting.

## Draft And Published Status

Pages can be `draft` or `published`. Phase 14 stores the status but does not publish output. Phase 15 uses this distinction for preview and static generation.

## Migration Notes

The model is deliberately file-based and human-readable. A future database migration can map sites, pages, sections, and blocks into relational or document storage while keeping IDs and schema fields stable for the builder UI.
