# Client Theme System

Phase 07 adds a client-branding layer for SloanSites-generated websites. It lets the builder apply a brand at the site, page, preview, or section level without rewriting every component class.

## Theme Wrappers

Use `.ss-client-theme` or `[data-ss-client-theme]` around a published site, builder preview page, or individual section:

```html
<main class="ss-client-theme ss-theme-emerald ss-radius-rounded ss-shadow-soft">
  <section class="ss-section ss-section-hero">
    ...
  </section>
</main>
```

The wrapper maps client-facing variables back into existing semantic tokens used by buttons, cards, sections, forms, links, focus rings, and builder preview pages.

## Brand Variables

Client themes can override:

- `--ss-brand-primary`
- `--ss-brand-primary-hover`
- `--ss-brand-secondary`
- `--ss-brand-accent`
- `--ss-brand-bg`
- `--ss-brand-surface`
- `--ss-brand-surface-soft`
- `--ss-brand-border`
- `--ss-brand-heading`
- `--ss-brand-body`
- `--ss-brand-muted`
- `--ss-brand-inverted`
- `--ss-brand-link`
- `--ss-brand-focus`
- `--ss-brand-success`
- `--ss-brand-warning`
- `--ss-brand-danger`
- `--ss-brand-info`

Typography hooks include `--ss-theme-heading-font`, `--ss-theme-body-font`, `--ss-theme-mono-font`, heading/body weights, heading/body line heights, and `--ss-theme-font-scale`. The framework does not import external fonts.

## Presets

Generic color presets:

- `.ss-theme-blueprint`
- `.ss-theme-emerald`
- `.ss-theme-violet`
- `.ss-theme-slate`
- `.ss-theme-amber`

Shape presets:

- `.ss-radius-sharp`
- `.ss-radius-soft`
- `.ss-radius-rounded`
- `.ss-radius-pill-heavy`

Shadow presets:

- `.ss-shadow-flat`
- `.ss-shadow-soft`
- `.ss-shadow-elevated`
- `.ss-shadow-strong`

Density presets:

- `.ss-density-compact`
- `.ss-density-comfortable`
- `.ss-density-spacious`

Button feel presets:

- `.ss-buttons-filled`
- `.ss-buttons-soft`
- `.ss-buttons-outline`
- `.ss-buttons-rounded`
- `.ss-buttons-minimal`

Section style helpers:

- `.ss-section-style-plain`
- `.ss-section-style-soft`
- `.ss-section-style-bordered`
- `.ss-section-style-tinted`
- `.ss-section-style-dark`
- `.ss-section-style-gradient`

## Builder Preview Helpers

Theme selectors and compact previews can use `.ss-theme-swatch-card`, `.ss-theme-preview-card`, `.ss-theme-color-row`, `.ss-theme-color-chip`, `.ss-theme-mini-preview`, `.ss-theme-mini-bar`, and `.ss-theme-mini-line`.

These are editor-preview UI helpers. Published wrappers such as `data-ss-builder-mode="published"` and `data-ss-published="true"` defensively hide theme preview cards.

## Dark Mode

Dark mode and client themes are separate concerns. Use `.ss-theme-dark` or `[data-ss-theme="dark"]` for dark mode, and `.ss-client-theme` for brand customization. A client theme can live inside a dark region, or a dark section can live inside a client theme, as long as the app sets readable variables.
