# Phase 02 Layout and Utilities

Phase 02 adds a lightweight layout layer for responsive websites, dashboards, forms, cards, and SaaS-style pages. The framework stays class-first: tokens are global, and visual behavior is applied with `ss-*` classes.

## Layout Philosophy

The utility system favors common layout work over exhaustive coverage. Classes are short, predictable, and mobile-first. Responsive modifiers are included where they matter most: display, grid columns, flex direction, text alignment, and a small set of spacing helpers.

## Containers

- `.ss-container` creates a centered page container with a standard max width.
- `.ss-container-narrow` is for readable article or settings pages.
- `.ss-container-wide` is for dashboards and admin surfaces.
- `.ss-container-full` spans the viewport and keeps mobile-safe horizontal padding.

All containers use `--ss-page-gutter` for horizontal spacing.

## Breakpoints

The responsive system is mobile-first:

- `sm`: 640px, larger phones and small tablets.
- `md`: 768px, tablets and compact laptops.
- `lg`: 1024px, desktop layouts.
- `xl`: 1280px, wide desktop layouts.
- `2xl`: 1440px, ultra-wide workspaces.

Responsive classes use the breakpoint after the prefix, such as `.ss-md-cols-3`, `.ss-lg-flex`, and `.ss-sm-text-center`.

## Grid

Use `.ss-grid` with column helpers:

- `.ss-cols-1`, `.ss-cols-2`, `.ss-cols-3`, `.ss-cols-4`, `.ss-cols-6`, `.ss-cols-12`.
- Responsive column helpers such as `.ss-md-cols-2`, `.ss-lg-cols-4`, and `.ss-xl-cols-6`.
- `.ss-grid-auto` creates an auto-fit card grid using `--ss-grid-min`, defaulting to `16rem`.

Gap utilities use the Phase 01 spacing scale: `.ss-gap-0`, `.ss-gap-1`, `.ss-gap-2`, `.ss-gap-3`, `.ss-gap-4`, `.ss-gap-6`, `.ss-gap-8`, and `.ss-gap-12`.

## Flex and Display

Common flex helpers include `.ss-flex`, `.ss-inline-flex`, `.ss-row`, `.ss-col`, `.ss-wrap`, `.ss-items-center`, `.ss-justify-between`, `.ss-grow`, and `.ss-shrink-0`.

Composition helpers cover frequent layouts:

- `.ss-stack` for vertical layouts.
- `.ss-cluster` for wrapping inline groups.
- `.ss-split` for two-sided rows.
- `.ss-center` for centered content.

Display helpers include `.ss-block`, `.ss-inline`, `.ss-inline-block`, `.ss-grid-display`, `.ss-hidden`, and `.ss-sr-only`. Use `.ss-sr-only` for accessible hidden text; `.ss-hidden` removes content visually and from layout.

## Spacing and Sizing

Spacing utilities use a limited set from the token scale: `0`, `1`, `2`, `3`, `4`, `6`, `8`, and `12`.

Patterns include:

- `.ss-m-4`, `.ss-p-4` for all sides.
- `.ss-mx-4`, `.ss-my-4`, `.ss-px-4`, `.ss-py-4` for axes.
- `.ss-mt-4`, `.ss-mr-4`, `.ss-mb-4`, `.ss-ml-4` and matching padding classes for sides.
- `.ss-m-auto`, `.ss-mx-auto`, `.ss-ml-auto`, and `.ss-mr-auto` for centering and layout pushing.

Sizing helpers include `.ss-w-full`, `.ss-w-auto`, `.ss-w-fit`, `.ss-w-min`, `.ss-w-25`, `.ss-w-33`, `.ss-w-50`, `.ss-w-75`, `.ss-h-full`, `.ss-h-auto`, `.ss-min-h-screen`, and `.ss-min-h-half`.

## Text and Color

Text utilities cover alignment, weight, size, line height, transform, wrapping, and truncation. Color utilities map to the official palette, including `.ss-text-muted`, `.ss-text-soft`, `.ss-text-primary`, `.ss-text-success`, `.ss-text-warning`, `.ss-text-danger`, `.ss-text-info`, and `.ss-text-accent`.

Use `.ss-truncate` only on an element with a constrained width or a flex/grid track that can shrink.

## Backgrounds, Borders, Radius, and Shadows

Background utilities include surface, soft, semantic soft colors, primary, and dark surfaces. Strong backgrounds such as `.ss-bg-primary`, `.ss-bg-dark`, and `.ss-bg-dark-surface` include inverted text by default.

Borders include `.ss-border`, `.ss-border-0`, directional borders, and semantic border colors. Radius and shadow utilities map directly to Phase 01 tokens, such as `.ss-radius-md`, `.ss-radius-pill`, `.ss-shadow-sm`, and `.ss-shadow-overlay`.

## Position and Layers

Basic position helpers include `.ss-static`, `.ss-relative`, `.ss-absolute`, `.ss-fixed`, `.ss-sticky`, `.ss-inset-0`, and side-zero helpers. Z-index helpers match the token scale: `.ss-z-dropdown`, `.ss-z-sticky`, `.ss-z-overlay`, `.ss-z-modal`, and `.ss-z-toast`.
