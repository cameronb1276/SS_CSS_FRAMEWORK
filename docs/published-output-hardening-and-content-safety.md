# Published Output Hardening and Content Safety

Phase 09 adds resilient wrappers and utilities for real generated client websites. These classes help SloanSites output survive long business names, messy client copy, oversized media, embeds, wide tables, crowded navigation, and accidental builder artifacts.

## Published Wrappers

Use `.ss-site`, `.ss-site-page`, `.ss-published`, or `[data-ss-published="true"]` on generated output:

```html
<body class="ss-page ss-site ss-published" data-ss-published="true">
  ...
</body>
```

These wrappers set safe width behavior and defensively hide builder UI such as topbars, inspector panels, layer trees, handles, drop zones, asset browsers, mini previews, and theme selector cards. They do not hide normal website sections, cards, forms, navs, buttons, or client content.

## Long Text

Use `.ss-safe-text`, `.ss-safe-title`, `.ss-safe-link`, `.ss-safe-email`, `.ss-safe-url`, `.ss-safe-button`, `.ss-safe-cell`, `.ss-business-name`, `.ss-service-name`, `.ss-staff-name`, and `.ss-nav-safe` for content likely to be messy.

Truncation helpers:

- `.ss-truncate-2`
- `.ss-truncate-3`

Overflow helpers:

- `.ss-overflow-hidden`
- `.ss-overflow-auto`
- `.ss-overflow-x-auto`
- `.ss-overflow-y-auto`
- `.ss-break-words`
- `.ss-break-normal`
- `.ss-whitespace-normal`
- `.ss-max-w-text`
- `.ss-max-w-content`
- `.ss-safe-area`

## Media And Embeds

Media wrappers include `.ss-media`, `.ss-media-frame`, `.ss-image-frame`, `.ss-logo-frame`, `.ss-avatar-frame`, `.ss-gallery-media`, and `.ss-missing-media`.

Aspect and fit helpers include `.ss-aspect-square`, `.ss-aspect-wide`, `.ss-aspect-video`, `.ss-aspect-4-3`, `.ss-aspect-map`, `.ss-aspect-form`, `.ss-media-cover`, `.ss-media-contain`, `.ss-object-cover`, `.ss-object-contain`, `.ss-object-center`, `.ss-object-top`, and `.ss-object-bottom`.

Embed wrappers include `.ss-embed`, `.ss-embed-responsive`, `.ss-embed-video`, `.ss-embed-map`, `.ss-embed-calendar`, and `.ss-embed-form`. Put the iframe directly inside the wrapper.

## Tables

Use `.ss-table-responsive` or `.ss-table-scroll` around tables that may become too wide. Table modifiers include `.ss-table-compact`, `.ss-table-hours`, `.ss-table-pricing`, `.ss-table-service-area`, and `.ss-table-key-value`.

## Navigation, Forms, And Actions

Navigation helpers:

- `.ss-nav-wrap`
- `.ss-nav-scroll`
- `.ss-nav-stack`
- `.ss-nav-mobile-stack`
- `.ss-footer-nav-group`

Form helpers:

- `.ss-form-safe`
- `.ss-field-stack`
- `.ss-field-inline`
- `.ss-check-group`
- `.ss-radio-group`
- `.ss-help-text`
- `.ss-error-text`
- `.ss-required-mark`
- `.ss-file-input`

Action helpers:

- `.ss-actions-left`
- `.ss-actions-right`
- `.ss-actions-center`
- `.ss-actions-between`
- `.ss-actions-stack`
- `.ss-actions-full-mobile`

## Accessibility And Print

`.ss-skip-link` provides a visible-on-focus skip link. Reduced-motion behavior from earlier phases remains intact. Print styles hide builder UI, remove heavy backgrounds/shadows, and keep tables/content readable.
