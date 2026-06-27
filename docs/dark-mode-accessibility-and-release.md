# Dark Mode, Accessibility, and Release Notes

SS CSS Framework `0.2.0` is designed as a single-file CSS framework with optional dark mode and no required JavaScript.

## Dark Mode

Dark mode is developer-controlled:

- `.ss-theme-dark` enables dark mode for an element and its children.
- `[data-ss-theme="dark"]` enables the same dark mode token set through an attribute.
- `.ss-theme-light` can be used to explicitly mark a light-themed region.
- `.ss-theme-system` follows `prefers-color-scheme: dark` only when the user agent reports a dark preference.

Dark mode updates semantic tokens for page background, surfaces, soft surfaces, borders, text, muted text, focus rings, status text, soft status backgrounds, overlays, and shadows. Components and utilities that use these semantic tokens adapt automatically.

## Accessibility Review

- Links remain underlined by default.
- Focus states use visible outlines or component-level focus rings.
- Form validation states use color plus a thicker left border.
- Disabled states use tokenized background, border, and text colors.
- `.ss-sr-only` provides screen-reader-accessible hidden content.
- Spinners, loading buttons, and skeletons respect `prefers-reduced-motion`.
- Native element semantics are preserved; the framework does not replace HTML behavior with CSS.

Interactive behavior such as dropdown opening, modal focus trapping, toast dismissal, tab switching, and accordion expand/collapse is intentionally outside the CSS release.

## Responsive Review

The demo pages cover mobile-first containers, responsive grids, card layouts, forms, tables with `.ss-table-responsive`, nav patterns, and dashboard-style panels. Containers use `--ss-page-gutter` so mobile layouts retain safe horizontal padding.

## Browser Support

Target browsers:

- Current Chromium-based browsers.
- Current Firefox.
- Current Safari.

Known browser notes:

- `color-mix()` is used as an enhancement for focus outlines with a solid outline fallback declared first.
- `.ss-theme-system` depends on `prefers-color-scheme`.
- No Internet Explorer support is planned.

## Release Scope

Version `0.2.0` includes:

- Foundation tokens and class-based base styles.
- Layout and utility helpers.
- Reusable components and UI pattern appearance.
- Explicit and optional system dark mode.
- Builder canvas and builder UI classes.
- Business website section primitives and client theme helpers.
- Published-site safety utilities.
- User documentation, focused examples, a full demo page, and minified CSS output.
