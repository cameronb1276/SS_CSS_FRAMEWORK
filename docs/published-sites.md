# Published Site Guide

Published client sites should use the normal website classes plus the published safety wrapper.

The optional Phase 15 backend publish pipeline can generate this structure from site JSON. See [static-publish-output.md](static-publish-output.md).

## Recommended Wrapper

```html
<body class="ss-page ss-site ss-published ss-client-theme ss-theme-blueprint" data-ss-published="true">
  <main class="ss-site-page">
    ...
  </main>
</body>
```

## Required Files

Published sites need only one CSS file:

```html
<link rel="stylesheet" href="dist/ss.min.css">
```

Use `dist/ss.css` during development when readable output is helpful.

## Classes To Remove

Prefer removing editor-only classes before publishing:

- `.ss-builder-app`
- `.ss-builder-topbar`
- `.ss-builder-sidebar`
- `.ss-builder-inspector`
- `.ss-builder-panel`
- `.ss-builder-layer-*`
- `.ss-builder-control-*`
- `.ss-builder-asset-*`
- `.ss-builder-mini-preview-*`
- `.ss-builder-handle`
- `.ss-builder-dropzone`

The published wrapper hides these defensively, but clean output is better.

## Themes

Apply a client theme with `.ss-client-theme` plus a preset or generated brand variables. Dark mode is separate from client branding.

## Content Safety

Use:

- `.ss-safe-title`, `.ss-safe-text`, `.ss-safe-email`, `.ss-safe-url` for messy text
- `.ss-media-frame`, `.ss-missing-media`, `.ss-embed-video`, `.ss-embed-map` for media and embeds
- `.ss-table-responsive` around wide tables
- `.ss-nav-wrap`, `.ss-nav-scroll`, `.ss-nav-mobile-stack` for crowded nav
- `.ss-form-safe`, `.ss-field-inline`, `.ss-help-text`, `.ss-error-text` for generated forms
- `.ss-actions-full-mobile` for CTA groups that should stack on phones

## QA Checklist

Check desktop and mobile widths, long business names, long emails and URLs, images, maps, videos, tables, forms, dark mode if used, and print output for important business pages.
