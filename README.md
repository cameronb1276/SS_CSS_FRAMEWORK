# SS CSS Framework

SS CSS Framework is a lightweight, class-based CSS framework for business websites, dashboards, SaaS pages, admin panels, and client projects. It works by linking one CSS file and does not require JavaScript or external CSS dependencies.

Current release: `0.2.0`

## Quick Start

Use the readable distribution file:

```html
<link rel="stylesheet" href="dist/ss.css">
```

Or use the minified release file:

```html
<link rel="stylesheet" href="dist/ss.min.css">
```

Attach SS classes to the elements you want to style:

```html
<body class="ss-page">
  <main class="ss-container ss-py-8">
    <h1 class="ss-h1">Page title</h1>
    <p class="ss-text">Readable body copy with a <a class="ss-link" href="#">link</a>.</p>
    <button class="ss-btn" type="button">Action</button>
  </main>
</body>
```

## What Is Included

- Foundation tokens for color, typography, spacing, radius, shadows, motion, layout widths, and z-index.
- Class-based typography, media, forms, tables, and content foundation styles.
- Responsive containers, grids, flex helpers, display helpers, spacing, sizing, text, color, border, radius, shadow, position, and z-index utilities.
- Components for buttons, badges, alerts, cards, forms, input groups, tables, navigation, dropdown appearance, modal appearance, toasts, progress, skeletons, accordions, list groups, and avatars.
- Explicit dark mode with `.ss-theme-dark` or `[data-ss-theme="dark"]`.
- Optional system preference support with `.ss-theme-system`.
- Builder-specific primitives for canvas editing, responsive previews, editable states, drop zones, handles, and published-output cleanup.
- Business website section primitives and local-business patterns for reusable builder-generated pages.
- Client theme wrappers, brand variables, and preset theme helpers for generated client websites.
- Builder application UI classes for the SloanSites editor shell, panels, inspector controls, layer tree, assets, and statuses.
- Published-output hardening utilities for long content, media, embeds, tables, navigation, forms, actions, print basics, and builder-artifact cleanup.
- Optional TypeScript/Express theme settings backend for local builder workflows, per-site JSON storage, and generated site theme CSS.

## Color Palette

The official palette is centered on a blue primary color with slate neutrals:

- Primary `#3B82F6`, hover `#2563EB`
- Secondary `#64748B`
- Accent `#A855F7`
- Success `#22C55E`
- Warning `#F59E0B`
- Danger `#EF4444`
- Info `#06B6D4`
- Background `#F8FAFC`, surface `#FFFFFF`, soft surface `#F1F5F9`
- Text `#0F172A`, muted `#475569`, soft `#94A3B8`, inverted `#FFFFFF`
- Dark background `#0B1120`, dark surface `#111827`, dark soft surface `#1E293B`, dark border `#334155`

All values are exposed as CSS custom properties with the `--ss-` prefix.

## Containers and Grids

Use containers to set readable page widths:

```html
<main class="ss-container">Standard page</main>
<main class="ss-container-narrow">Readable text page</main>
<main class="ss-container-wide">Dashboard page</main>
<main class="ss-container-full">Full-width app shell</main>
```

Use `.ss-grid` with column helpers:

```html
<section class="ss-grid ss-cols-1 ss-md-cols-2 ss-lg-cols-3 ss-gap-4">
  <article class="ss-card"><div class="ss-card-body">Card</div></article>
  <article class="ss-card"><div class="ss-card-body">Card</div></article>
  <article class="ss-card"><div class="ss-card-body">Card</div></article>
</section>
```

Breakpoints are mobile-first: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, and `2xl` 1440px.

## Utilities

The utility layer intentionally stays moderate. It includes helpers for:

- Display: `.ss-block`, `.ss-flex`, `.ss-grid-display`, `.ss-hidden`, `.ss-sr-only`
- Flex: `.ss-row`, `.ss-col`, `.ss-wrap`, `.ss-items-center`, `.ss-justify-between`
- Spacing: `.ss-p-4`, `.ss-px-4`, `.ss-py-4`, `.ss-mt-4`, `.ss-mx-auto`
- Sizing: `.ss-w-full`, `.ss-w-fit`, `.ss-w-50`, `.ss-min-h-screen`
- Text: `.ss-text-center`, `.ss-fw-semibold`, `.ss-fs-lg`, `.ss-truncate`
- Color and surfaces: `.ss-text-muted`, `.ss-bg-surface`, `.ss-bg-primary-soft`
- Borders, radius, and shadows: `.ss-border`, `.ss-border-accent`, `.ss-radius-lg`, `.ss-shadow-md`
- Position and layers: `.ss-relative`, `.ss-sticky`, `.ss-inset-0`, `.ss-z-modal`

See [docs/layout-and-utilities.md](docs/layout-and-utilities.md) for the fuller utility guide.

## Components

Components are class-based and compose with utilities:

```html
<article class="ss-card ss-card-elevated">
  <div class="ss-card-body ss-stack">
    <span class="ss-badge ss-badge-soft ss-badge-success">Active</span>
    <h2 class="ss-card-title">Project card</h2>
    <p class="ss-text ss-text-muted">Components compose with utility classes.</p>
    <button class="ss-btn" type="button">Open</button>
  </div>
</article>
```

See [docs/components-and-patterns.md](docs/components-and-patterns.md) for supported variants and behavior notes.

## Website Sections

SS CSS includes business website section primitives for builder-generated and published sites. Use `.ss-section` with modifiers such as `.ss-section-hero`, `.ss-section-services`, `.ss-section-about`, `.ss-section-cta`, `.ss-section-pricing`, `.ss-section-testimonials`, `.ss-section-faq`, `.ss-section-gallery`, `.ss-section-contact`, and `.ss-section-footer`.

Section content classes such as `.ss-section-header`, `.ss-section-title`, `.ss-section-subtitle`, `.ss-section-actions`, and `.ss-section-media` compose with utilities and components. Local business patterns include service cards, pricing cards, testimonials, business hours, location cards, map wrappers, coupons, announcement bars, emergency banners, phone strips, and service-area lists.

See [docs/website-sections-and-local-business-patterns.md](docs/website-sections-and-local-business-patterns.md) and [examples/sections.html](examples/sections.html).

## Client Themes

Use `.ss-client-theme` or `[data-ss-client-theme]` to apply client branding at a site, page, builder preview, or section level. Brand variables such as `--ss-brand-primary`, `--ss-brand-surface`, `--ss-brand-heading`, `--ss-brand-body`, and `--ss-brand-focus` map back into the framework's semantic tokens.

Preset helpers include `.ss-theme-blueprint`, `.ss-theme-emerald`, `.ss-theme-violet`, `.ss-theme-slate`, and `.ss-theme-amber`, plus radius, shadow, density, button-style, and section-style presets. This is separate from dark mode: dark mode controls light/dark surfaces, while client themes control brand identity.

See [docs/client-theme-system.md](docs/client-theme-system.md) and [examples/themes.html](examples/themes.html).

## Dark Mode

Dark mode is opt-in and class-based:

```html
<body class="ss-page ss-theme-dark">
  ...
</body>
```

You can also use an attribute:

```html
<html data-ss-theme="dark">
```

For OS preference support without forcing dark mode, add `.ss-theme-system`:

```html
<body class="ss-page ss-theme-system">
```

Dark mode adjusts surfaces, borders, text, focus rings, soft status backgrounds, overlays, and shadows.

## Builder Primitives

SS CSS now includes editor-only classes for the SloanSites website builder. Use `.ss-builder-*` classes for builder shell, canvas, stage, viewport, page, editable regions, drop zones, handles, and placeholders.

Builder state can be controlled with classes such as `.ss-is-selected`, `.ss-is-dragging`, `.ss-is-hidden`, and `.ss-is-invalid`, or with attributes such as `data-ss-builder-mode`, `data-ss-device`, `data-ss-state`, and `data-ss-drop-position`.

Published pages should not include active builder state classes unless intentionally needed. When `data-ss-builder-mode="published"` or `data-ss-published="true"` is present, editor handles, drop zones, overlays, outlines, and hidden builder items are removed from the visual output.

See [docs/builder-canvas-and-editable-states.md](docs/builder-canvas-and-editable-states.md) and [examples/builder.html](examples/builder.html).

## Builder App UI

SS CSS also includes editor-application classes for the SloanSites builder interface around the canvas. Use `.ss-builder-app`, `.ss-builder-topbar`, `.ss-builder-app-main`, `.ss-builder-sidebar`, `.ss-builder-inspector`, `.ss-builder-layer-*`, `.ss-builder-control-*`, `.ss-builder-asset-*`, and `.ss-builder-status-*` classes for the webapp shell.

These classes are separate from published website classes. Published sites should not depend on inspector, sidebar, toolbar, layer tree, asset browser, or status UI classes.

See [docs/builder-ui-shell-inspector-and-layer-panel.md](docs/builder-ui-shell-inspector-and-layer-panel.md) and [examples/builder-ui.html](examples/builder-ui.html).

## Published Safety

Generated client sites can use `.ss-site`, `.ss-site-page`, `.ss-published`, or `[data-ss-published="true"]` to harden published output. These wrappers help prevent horizontal overflow and defensively hide editor-only artifacts if handles, drop zones, inspector panels, layer trees, asset browsers, or theme preview controls accidentally remain in markup.

Content safety helpers cover long names, emails, URLs, buttons, responsive media, iframe embeds, scrollable tables, wrapping navigation, safer form layouts, action groups, skip links, and print basics.

See [docs/published-output-hardening-and-content-safety.md](docs/published-output-hardening-and-content-safety.md) and [examples/published-safety.html](examples/published-safety.html).

## Optional Theme Settings Backend

Phase 11 adds an optional Node.js, TypeScript, and Express backend in `server/theme-settings/`. It defaults to port `3004` and lets a future builder create per-site `settings.json` files, validate theme updates, preserve backups, generate scoped `theme.css`, and store custom CSS/JS separately from the framework.

The CSS framework does not depend on this backend. Published sites should still load base SS CSS first, then the generated site theme CSS.

See [server/theme-settings/README.md](server/theme-settings/README.md).

## Optional Theme Editor

Phase 12 adds a builder-facing reference editor at [examples/theme-editor.html](examples/theme-editor.html). Start the optional backend on port `3004`, load or create a test site, edit theme controls with live preview, save settings, and rebuild the generated `theme.css`.

See [docs/theme-editor-integration.md](docs/theme-editor-integration.md).

## Backend Hardening

Phase 13 adds auth-aware structure, production fail-closed behavior, write rate limiting, stricter request guards, audit logging, and safer custom JS defaults around the optional backend. The CSS framework itself still has no backend dependency.

See [docs/theme-backend-security-hardening.md](docs/theme-backend-security-hardening.md).

## Accessibility

SS CSS Framework keeps native semantics intact. Focus states are visible, links remain underlined, disabled states remain readable, validation states use a thicker left border in addition to color, `.ss-sr-only` is available for accessible hidden text, and motion-heavy helpers respect `prefers-reduced-motion`.

Interactive behavior such as modal focus trapping, dropdown toggling, tab switching, toast dismissal, and accordion state changes is intentionally not implemented in CSS.

## Browser Support

The framework targets current Chromium-based browsers, Firefox, and Safari. It uses progressive CSS features carefully and keeps the core layout and component system usable without JavaScript.

Known limitations:

- `.ss-theme-system` depends on `prefers-color-scheme`.
- `color-mix()` improves focus outlines where supported; a solid outline fallback is included.
- No legacy Internet Explorer support is planned.

## Customization

Override tokens after loading the framework:

```css
:root {
  --ss-color-primary: #0ea5e9;
  --ss-radius-default: 0.375rem;
  --ss-page-gutter: clamp(1rem, 4vw, 2.5rem);
}
```

Theme overrides can be scoped:

```css
.brand-theme {
  --ss-color-primary: #7c3aed;
  --ss-color-primary-hover: #6d28d9;
}
```

## Project Structure

```text
src/       Source CSS
dist/      Drop-in CSS release files
docs/      Framework documentation and guides
examples/  Demo and focused examples
server/    Optional backend services for builder workflows
```

`instructions/` is used locally for controlled phase work and is intentionally ignored from GitHub.

## Documentation Entry Points

- [docs/index.html](docs/index.html): static docs landing page.
- [docs/class-reference.md](docs/class-reference.md): category-based class reference.
- [docs/builder-usage.md](docs/builder-usage.md): SloanSites builder implementation guide.
- [docs/theme-editor-integration.md](docs/theme-editor-integration.md): optional backend-powered theme editor workflow.
- [docs/theme-backend-security-hardening.md](docs/theme-backend-security-hardening.md): optional backend security and production-readiness notes.
- [docs/published-sites.md](docs/published-sites.md): published client site guide.
- [examples/readme.html](examples/readme.html): styled HTML version of this README.

## Development Workflow

The framework is a plain CSS project. Edit `src/ss.css`, then sync it to `dist/ss.css` and regenerate `dist/ss.min.css`. Before committing, check that source and distribution CSS match, examples only use defined `ss-` classes, and no external CSS framework dependency has been introduced.

Phase work should be committed and pushed one phase at a time using the phase instruction files.

## License

No separate license file is currently included.
