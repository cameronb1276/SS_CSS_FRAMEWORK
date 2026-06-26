# SS CSS Framework

SS CSS Framework is a plain CSS foundation for business websites, dashboards, SaaS pages, admin panels, and client projects. It is designed to work by linking a single CSS file, without JavaScript or external dependencies.

Phase 01 establishes the framework base:

- Semantic CSS custom properties for color, typography, spacing, radius, shadows, motion, layout widths, and z-index.
- A modern but conservative reset.
- Base styling for typography, links, forms, buttons, tables, media, code, blockquotes, and horizontal rules.
- Light theme defaults with dark theme tokens prepared for later phases.

## Quick Start

Use the distribution file in a normal HTML page:

```html
<link rel="stylesheet" href="dist/ss.css">
```

The source file is available at `src/ss.css`. During Phase 01, `dist/ss.css` mirrors the source file so the framework can already be dropped into a project.

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
