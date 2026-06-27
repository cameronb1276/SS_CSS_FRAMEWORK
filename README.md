# SS CSS Framework

SS CSS Framework is a plain CSS foundation for business websites, dashboards, SaaS pages, admin panels, and client projects. It is designed to work by linking a single CSS file, without JavaScript or external dependencies.

The framework currently includes:

- Semantic CSS custom properties for color, typography, spacing, radius, shadows, motion, layout widths, and z-index.
- A modern but conservative reset.
- Opt-in foundation classes for typography, links, forms, buttons, tables, media, code, blockquotes, and horizontal rules.
- Layout and utility classes for containers, grids, flexbox, spacing, sizing, text, color, borders, radius, shadows, positioning, and z-index.
- Component classes for buttons, badges, alerts, cards, forms, input groups, tables, navigation, dropdowns, modals, toasts, progress, skeletons, accordions, list groups, and avatars.
- Light theme defaults with dark theme tokens prepared for later phases.

## Quick Start

Use the distribution file in a normal HTML page:

```html
<link rel="stylesheet" href="dist/ss.css">
```

Attach SS classes to the elements you want to style:

```html
<body class="ss-page">
  <h1 class="ss-h1">Page title</h1>
  <p class="ss-text">Readable body copy with a <a class="ss-link" href="#">link</a>.</p>
  <button class="ss-btn" type="button">Action</button>
</body>
```

The source file is available at `src/ss.css`. The distribution file at `dist/ss.css` mirrors the source file so the framework can be dropped into a project.

## Layout Example

```html
<main class="ss-container ss-py-8">
  <section class="ss-grid ss-cols-1 ss-md-cols-2 ss-lg-cols-3 ss-gap-4">
    <article class="ss-bg-surface ss-border ss-radius-lg ss-shadow-sm ss-p-4">
      <h2 class="ss-h3">Card title</h2>
      <p class="ss-text ss-text-muted">Card content.</p>
    </article>
  </section>
</main>
```

## Component Example

```html
<article class="ss-card ss-card-elevated">
  <div class="ss-card-body">
    <span class="ss-badge ss-badge-soft ss-badge-success">Active</span>
    <h2 class="ss-card-title">Project card</h2>
    <p class="ss-text ss-text-muted">Components compose with utility classes.</p>
    <button class="ss-btn" type="button">Open</button>
  </div>
</article>
```

## Project Structure

```text
instructions/  Phase instructions for controlled development
src/           Source CSS
dist/          Drop-in CSS distribution file
docs/          Framework documentation
examples/      Small usage examples
```

## Development Notes

Development proceeds phase by phase. Phase 01 is complete when the foundation layer is in place, documented, committed, and pushed. Later phases should build on these tokens and base styles without replacing the foundation unnecessarily.
