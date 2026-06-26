# Phase 02 — Layout, Grid, Containers, and Utility Classes

Continue from Phase 01.

This phase must focus on layout systems and reusable utility classes.

Do not build the full component library yet.

Do not add JavaScript.

Do not use external CSS frameworks.

Keep the framework lightweight and easy to understand.

## Main Goal

Build the reusable layout layer for the CSS framework.

The framework should support responsive pages, dashboards, cards, forms, and marketing layouts.

Create containers, grid helpers, flex helpers, spacing utilities, sizing utilities, display utilities, text utilities, background utilities, border utilities, radius utilities, and shadow utilities.

## Required Output Files

Update the main framework CSS file.

Update documentation with the layout and utility system.

Add a changelog entry for Phase 02.

If examples are added, keep them simple and documentation-focused.

## Layout Philosophy

The framework should be easy to use without needing complex nested classes.

The default layout system should work well for business websites, admin panels, and SaaS-style dashboards.

Use predictable responsive behavior.

Avoid making the class system too large.

Favor useful utility coverage over copying every Bootstrap utility.

## Container System

Create a responsive container system.

Include a standard centered container.

Include a narrow container for readable text pages.

Include a wide container for dashboards and admin pages.

Include a full-width container for hero sections and app layouts.

Use sensible max-width values.

Ensure horizontal padding works well on mobile.

## Responsive Breakpoints

Create a simple breakpoint system.

Use mobile-first responsive design.

Include breakpoints for small, medium, large, extra-large, and ultra-wide screens.

Use breakpoint names consistently throughout the CSS.

Do not create too many breakpoints.

Document the breakpoint purpose clearly.

## Grid System

Create a responsive grid system.

Support common column layouts such as 1, 2, 3, 4, 6, and 12 columns.

Support auto-fit card grids.

Support grid gaps using the spacing scale from Phase 01.

Make mobile layouts stack naturally.

Avoid overly complicated row and column math.

Do not copy Bootstrap grid syntax exactly.

## Flex Utilities

Add utilities for flex direction, wrapping, alignment, justification, and gaps.

Support common patterns such as centered content, split rows, stacked columns, and responsive wrapping.

Keep class names readable.

Make these utilities useful for navbars, cards, forms, and dashboard panels.

## Display Utilities

Add utilities for block, inline, inline-block, flex, grid, none, and visually hidden content.

Include responsive display utilities only where they are genuinely useful.

Create a proper visually hidden utility for screen reader accessible hidden text.

Do not use display none as a replacement for accessibility-friendly hiding.

## Spacing Utilities

Create margin and padding utilities based on the Phase 01 spacing scale.

Include all sides, horizontal axis, vertical axis, top, right, bottom, and left variants.

Keep the scale limited and memorable.

Include auto margin utilities for common centering and pushing layouts.

Do not create hundreds of unnecessary spacing classes.

## Sizing Utilities

Add width and height utilities for common needs.

Include full width, auto width, fit content, minimum content where appropriate, and common percentage widths.

Include minimum height helpers for viewport-height layouts.

Avoid classes that are too specific to one project.

## Text Utilities

Add utilities for text alignment, font weight, font size, line height, text transform, text wrapping, and truncation.

Use the text colors from the official palette.

Include muted, soft, inverted, primary, success, warning, danger, info, and accent text utilities.

Ensure truncation utilities work only when the required layout conditions are present or documented.

## Background Utilities

Add background utilities for background, surface, surface soft, primary soft, accent soft, success soft, warning soft, danger soft, and dark surfaces.

Do not make strong background utilities unreadable.

If a strong background is included, pair it with guidance about text color.

Keep background utilities aligned with the official color system.

## Border Utilities

Add border utilities for default border, no border, top border, right border, bottom border, left border, and border color variants.

Use the official border colors.

Include subtle border classes suitable for cards and panels.

Do not overuse heavy borders.

## Radius Utilities

Add radius utilities based on the Phase 01 radius scale.

Include none, small, medium, large, extra-large, pill, and full.

Make the naming consistent with the token system.

## Shadow Utilities

Add shadow utilities based on the Phase 01 shadow scale.

Include none, small, medium, large, and overlay.

Make shadows subtle and professional.

## Position Utilities

Add basic position utilities for static, relative, absolute, fixed, and sticky.

Add common inset helpers only if they remain simple.

Avoid turning this into a full positioning language.

## Z-Index Utilities

Add z-index utilities that match the Phase 01 z-index token scale.

Support common layers such as dropdown, sticky, overlay, modal, and toast.

Keep z-index values centralized.

## Responsive Rules

All layout utilities should follow mobile-first behavior.

Responsive modifiers should be consistent.

Avoid creating responsive versions of every single class unless they are valuable.

Prefer responsive classes for display, grid columns, flex direction, text alignment, and spacing.

## Documentation Requirements

Document the layout philosophy.

Document containers.

Document breakpoints.

Document grid usage.

Document utility naming patterns.

Document common page layout examples in plain language.

Do not include large code-heavy examples.

## Quality Checklist

Containers work on mobile, tablet, desktop, and wide screens.

Grid layouts stack properly on small screens.

Flex utilities cover common layout needs.

Spacing utilities use the foundation spacing scale.

Text and background utilities use the official palette.

Utility names are consistent.

No JavaScript was added.

No external framework was added.

No Bootstrap source code was copied.

Phase 02 documentation exists.

Phase 02 changelog entry exists.
