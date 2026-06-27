# Phase 01 Foundation

Phase 01 defines the base layer for SS CSS Framework. The goal is a clean, professional default style that can support business websites, dashboards, SaaS pages, admin panels, and client sites.

## Token System

All reusable values live in CSS custom properties with the `--ss-` prefix. The foundation includes token groups for:

- Colors and semantic color aliases.
- Typography sizes, line heights, font stacks, and weights.
- Spacing values from small interface gaps to section-level spacing.
- Radius values for square, subtle, rounded, pill, and circular shapes.
- Border width and soft shadow levels.
- Transition durations and easing.
- Layout widths and z-index layers.

The light theme is the default. Dark theme semantic tokens are available through `[data-ss-theme="dark"]` or `.ss-theme-dark`, but dark mode is not enabled automatically in this phase.

## Palette

The primary action color is blue `#3B82F6`, with `#2563EB` used for hover states. Slate neutrals control text, borders, surfaces, and secondary UI. Purple is reserved as an accent for future highlighted patterns. Success, warning, danger, and info colors are available as semantic tokens with soft background variants.

## Reset and Foundation Classes

The reset uses `border-box` and lightweight page normalization without visually styling raw HTML elements. Visual foundation styles are exposed as classes that can be attached to the matching elements.

Core Phase 01 classes include:

- `.ss-page` for page background, text color, font family, and base line height.
- `.ss-h1` through `.ss-h6`, `.ss-heading`, `.ss-text`, `.ss-link`, `.ss-list`, and `.ss-list-spaced` for typography.
- `.ss-quote`, `.ss-code`, `.ss-kbd`, `.ss-samp`, `.ss-pre`, `.ss-figure`, `.ss-caption`, and `.ss-hr` for content treatments.
- `.ss-label`, `.ss-field`, `.ss-select`, `.ss-textarea`, and `.ss-btn` for form and action elements.
- `.ss-table`, `.ss-tr`, `.ss-table-caption`, `.ss-th`, and `.ss-td` for table presentation.
- `.ss-img`, `.ss-media`, and `.ss-svg` for responsive media behavior.

## Accessibility

Focus states use a visible primary outline. Text colors are chosen for strong contrast on the default light background and prepared dark surfaces. Reduced motion preferences are respected by minimizing animation and transition durations when `prefers-reduced-motion: reduce` is active.

## Distribution

`src/ss.css` is the authored source file. `dist/ss.css` mirrors it for Phase 01 so the framework can be loaded as a single drop-in stylesheet.
