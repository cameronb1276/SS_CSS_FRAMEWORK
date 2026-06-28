# Changelog

## Unreleased

- Added Phase 11 optional TypeScript/Express theme settings backend under `server/theme-settings`.
- Added per-site JSON settings storage, safe site ID validation, color/preset validation, backup-before-replace writes, scoped `theme.css` generation, custom CSS storage, custom JS storage, and verification script.
- Backend defaults to port `3004` and is documented as local/builder infrastructure, not production-ready without authentication and deployment hardening.
- Added Phase 12 builder theme editor reference UI with site selection, live theme preview, save status, rebuild status, custom CSS controls, and custom JS disabled by default.
- Added a Phase 11 backend save/rebuild workflow from the editor and documentation for future SloanSites builder integration.
- Added Phase 13 backend auth/access-check structure, production fail-closed behavior, environment-driven origin/body/custom-code limits, write rate limiting, audit logging, safer custom JS handling, and backup restore guidance.
- Added Phase 14 site content JSON model with page, section, and block storage, default home page creation, page validation endpoints, and page backup-before-replace behavior.
- Added Phase 15 static publish pipeline with JSON page rendering, local preview output, published artifact cleanup, required CSS load order, custom CSS output, and gated custom JS publishing.
- Added Phase 16 element registry, normalized element tree adapter, parent/child validation, class and attribute safety checks, published-safety checks, and read-only registry/tree API endpoints.
- Added Phase 17 validated element mutation API for add, patch, delete, duplicate, move, rename, visibility, and lock operations with backup, audit, and publish compatibility checks.
- Added Phase 18 reference element tree builder UI with backend-loaded registry/tree data, tree/canvas selection sync, quick CRUD controls, visible error states, and documentation.
- Added Phase 19 inspector panel controls for selected elements, safe content and attribute saves, curated SS utility picker with simple class conflict handling, locked-state behavior, and documentation.
- Added Phase 20 reference drag-and-drop behavior for element tree rows and library items with registry-based drop feedback, backend add/move operations, keyboard fallbacks, and documentation.

## 0.2.0 - Builder and Published Site Toolkit

- Added builder canvas primitives for edit, preview, and published modes, including responsive device previews, editable states, drop zones, handles, placeholders, and builder documentation.
- Added website section primitives and local-business patterns for generated business sites.
- Added client theme wrappers, brand variables, preset themes, radius/shadow/density/button presets, section style helpers, and theme preview cards.
- Added builder app UI shell styles for topbars, sidebars, inspector controls, layer trees, page lists, device switchers, status states, swatches, spacing/typography controls, assets, and mini previews.
- Added published-output hardening for builder artifact cleanup, long text, responsive media, embeds, tables, navigation, forms, action groups, skip links, and print basics.
- Added static documentation pages, class reference, builder usage guide, published-site guide, and showcase links.

## 0.1.0 - First Release

- Added foundation tokens for color, typography, spacing, radius, shadows, motion, layout widths, and z-index.
- Added class-based base styles for pages, typography, media, forms, tables, code, blockquotes, and content elements.
- Added responsive containers, grid helpers, flex helpers, display helpers, spacing, sizing, text, background, border, radius, shadow, position, and z-index utilities.
- Added components for buttons, badges, alerts, cards, form controls, input groups, tables, navigation, dropdown appearance, modal appearance, toasts, progress, loading states, skeletons, accordions, list groups, and avatars.
- Added explicit dark mode through `.ss-theme-dark` and `[data-ss-theme="dark"]`.
- Added optional system-preference dark mode through `.ss-theme-system`.
- Added accessibility polish for focus states, disabled states, validation states, links, visually hidden content, and reduced motion.
- Added `dist/ss.css` and `dist/ss.min.css` as release-ready CSS files.
- Added README, foundation docs, utility docs, component docs, release notes, focused examples, and a full demo page.
- Completed Phase 04 release prep with dark mode, documentation, testing notes, demo coverage, and first-release polish.

## Known Limitations

- JavaScript behavior is not included for dropdowns, modals, tabs, toasts, or accordions.
- Browser support targets current Chromium-based browsers, Firefox, and Safari.
- No legacy Internet Explorer support is planned.
