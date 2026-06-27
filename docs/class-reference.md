# Class Reference

This reference lists the most useful public class families. It intentionally avoids listing every responsive or spacing variant.

## Foundation

- Page/base: `.ss-page`, `.ss-content`, `.ss-link`, `.ss-code`, `.ss-pre`, `.ss-blockquote`
- Accessibility: `.ss-sr-only`, `.ss-skip-link`
- Themes: `.ss-theme-light`, `.ss-theme-dark`, `.ss-theme-system`

## Typography

- Headings: `.ss-h1`, `.ss-h2`, `.ss-h3`, `.ss-h4`, `.ss-h5`, `.ss-h6`
- Text: `.ss-text`, `.ss-text-muted`, `.ss-text-soft`, `.ss-text-center`, `.ss-text-left`, `.ss-text-right`
- Weight/size: `.ss-fw-medium`, `.ss-fw-semibold`, `.ss-fw-bold`, `.ss-fs-sm`, `.ss-fs-lg`
- Safety: `.ss-safe-text`, `.ss-safe-title`, `.ss-safe-link`, `.ss-safe-email`, `.ss-safe-url`, `.ss-truncate-2`, `.ss-truncate-3`

## Layout

- Containers: `.ss-container`, `.ss-container-narrow`, `.ss-container-wide`, `.ss-container-full`
- Layout helpers: `.ss-stack`, `.ss-cluster`, `.ss-split`, `.ss-sidebar-layout`, `.ss-center`
- Display/flex: `.ss-block`, `.ss-flex`, `.ss-grid-display`, `.ss-hidden`, `.ss-row`, `.ss-col`, `.ss-wrap`, `.ss-items-center`, `.ss-justify-between`

## Grid

- Base: `.ss-grid`
- Columns: `.ss-cols-1`, `.ss-cols-2`, `.ss-cols-3`, `.ss-cols-4`
- Responsive examples: `.ss-md-cols-2`, `.ss-lg-cols-3`, `.ss-lg-cols-4`
- Gaps: `.ss-gap-2`, `.ss-gap-4`, `.ss-gap-6`, `.ss-gap-8`

## Spacing

- Margin: `.ss-m-0`, `.ss-m-4`, `.ss-mx-auto`, `.ss-mt-4`, `.ss-mb-8`
- Padding: `.ss-p-4`, `.ss-p-6`, `.ss-px-4`, `.ss-py-8`

## Colors

- Text: `.ss-text-muted`, `.ss-text-success`, `.ss-text-warning`, `.ss-text-danger`, `.ss-text-info`
- Backgrounds: `.ss-bg-page`, `.ss-bg-surface`, `.ss-bg-soft`, `.ss-bg-primary-soft`, `.ss-bg-accent-soft`

## Borders, Radius, Shadows

- Borders: `.ss-border`, `.ss-border-0`, `.ss-border-primary`, `.ss-border-accent`
- Radius: `.ss-radius-sm`, `.ss-radius-md`, `.ss-radius-lg`, `.ss-radius-xl`, `.ss-radius-pill`, `.ss-radius-full`
- Shadows: `.ss-shadow-sm`, `.ss-shadow-md`, `.ss-shadow-lg`, `.ss-shadow-none`

## Forms

- Labels and controls: `.ss-label`, `.ss-select`, `.ss-textarea`, `.ss-input-group`, `.ss-input-addon`
- States: `.ss-is-valid`, `.ss-is-invalid`
- Safety: `.ss-form-safe`, `.ss-field-stack`, `.ss-field-inline`, `.ss-check-group`, `.ss-radio-group`, `.ss-help-text`, `.ss-error-text`, `.ss-required-mark`, `.ss-file-input`

## Buttons

- Base: `.ss-btn`
- Sizes: `.ss-btn-sm`, `.ss-btn-lg`, `.ss-btn-icon`
- Variants: `.ss-btn-secondary`, `.ss-btn-accent`, `.ss-btn-success`, `.ss-btn-warning`, `.ss-btn-danger`, `.ss-btn-info`, `.ss-btn-ghost`, `.ss-btn-soft`, `.ss-btn-outline`, `.ss-btn-link`
- Action groups: `.ss-actions`, `.ss-actions-center`, `.ss-actions-left`, `.ss-actions-right`, `.ss-actions-between`, `.ss-actions-stack`, `.ss-actions-full-mobile`

## Cards

- Base: `.ss-card`, `.ss-card-body`, `.ss-card-header`, `.ss-card-footer`
- Variants: `.ss-card-flat`, `.ss-card-bordered`, `.ss-card-elevated`, `.ss-card-interactive`, `.ss-card-media`

## Navigation

- Navbars: `.ss-navbar`, `.ss-navbar-brand`, `.ss-nav`, `.ss-navbar-link`, `.ss-navbar-link-active`
- Safety: `.ss-nav-safe`, `.ss-nav-wrap`, `.ss-nav-scroll`, `.ss-nav-stack`, `.ss-nav-mobile-stack`, `.ss-footer-nav-group`

## Modals, Toasts, Alerts

- Alerts: `.ss-alert`, `.ss-alert-title`, `.ss-alert-desc`, status variants
- Modals: `.ss-modal-backdrop`, `.ss-modal`, `.ss-modal-header`, `.ss-modal-body`, `.ss-modal-footer`
- Toasts: `.ss-toast`, `.ss-toast-title`, `.ss-toast-desc`

## Media, Embeds, Tables

- Media: `.ss-media`, `.ss-media-frame`, `.ss-image-frame`, `.ss-logo-frame`, `.ss-avatar-frame`, `.ss-gallery-media`, `.ss-missing-media`
- Fit/aspect: `.ss-media-cover`, `.ss-media-contain`, `.ss-object-cover`, `.ss-object-contain`, `.ss-aspect-square`, `.ss-aspect-video`, `.ss-aspect-map`
- Embeds: `.ss-embed`, `.ss-embed-video`, `.ss-embed-map`, `.ss-embed-calendar`, `.ss-embed-form`
- Tables: `.ss-table`, `.ss-table-responsive`, `.ss-table-scroll`, `.ss-table-compact`, `.ss-table-hours`, `.ss-table-pricing`, `.ss-table-service-area`, `.ss-table-key-value`

## Builder Canvas

- Shell/canvas: `.ss-builder`, `.ss-builder-shell`, `.ss-builder-workspace`, `.ss-builder-canvas`, `.ss-builder-stage`, `.ss-builder-viewport`, `.ss-builder-page`
- Devices: `[data-ss-device="desktop"]`, `[data-ss-device="tablet"]`, `[data-ss-device="mobile"]`, `.ss-builder-device-full`
- Editables: `.ss-builder-section`, `.ss-builder-block`, `.ss-builder-container`, `.ss-builder-text`, `.ss-builder-image`, `.ss-builder-embed`
- States: `.ss-is-selected`, `.ss-is-hovered`, `.ss-is-dragging`, `.ss-is-locked`, `.ss-is-hidden`, `.ss-is-invalid`, `.ss-is-empty`
- Handles/drop: `.ss-builder-handle`, `.ss-builder-handle-bar`, `.ss-builder-dropzone`, `.ss-builder-dropzone-active`, `.ss-builder-drag-ghost`

## Builder UI

- Shell: `.ss-builder-app`, `.ss-builder-topbar`, `.ss-builder-app-main`, `.ss-builder-statusbar`
- Panels: `.ss-builder-sidebar`, `.ss-builder-inspector`, `.ss-builder-panel`
- Controls: `.ss-builder-control-group`, `.ss-builder-control-row`, `.ss-builder-control-label`, `.ss-builder-control-segmented`, `.ss-builder-segment`
- Layers/pages: `.ss-builder-layer-list`, `.ss-builder-layer-row`, `.ss-builder-page-list`, `.ss-builder-page-item`
- Assets/previews/status: `.ss-builder-asset-grid`, `.ss-builder-asset-card`, `.ss-builder-mini-preview-card`, `.ss-builder-status`

## Sections

- Base: `.ss-section`, `.ss-section-sm`, `.ss-section-lg`, `.ss-section-xl`
- Intent: `.ss-section-hero`, `.ss-section-feature`, `.ss-section-services`, `.ss-section-about`, `.ss-section-cta`, `.ss-section-pricing`, `.ss-section-testimonials`, `.ss-section-faq`, `.ss-section-gallery`, `.ss-section-contact`, `.ss-section-footer`
- Content: `.ss-section-header`, `.ss-section-eyebrow`, `.ss-section-title`, `.ss-section-subtitle`, `.ss-section-actions`, `.ss-section-media`
- Local business: `.ss-business-hours-card`, `.ss-location-card`, `.ss-review-summary-card`, `.ss-emergency-banner`, `.ss-announcement-bar`, `.ss-coupon-card`, `.ss-phone-strip`

## Themes

- Wrapper: `.ss-client-theme`, `[data-ss-client-theme]`
- Presets: `.ss-theme-blueprint`, `.ss-theme-emerald`, `.ss-theme-violet`, `.ss-theme-slate`, `.ss-theme-amber`
- Radius/shadow/density/buttons: `.ss-radius-rounded`, `.ss-shadow-elevated`, `.ss-density-compact`, `.ss-buttons-soft`
- Preview: `.ss-theme-swatch-card`, `.ss-theme-preview-card`, `.ss-theme-color-row`, `.ss-theme-mini-preview`

## Published Safety

- Wrappers: `.ss-site`, `.ss-site-page`, `.ss-published`, `[data-ss-published="true"]`
- Overflow: `.ss-overflow-hidden`, `.ss-overflow-auto`, `.ss-overflow-x-auto`, `.ss-break-words`, `.ss-whitespace-normal`
- Print: `.ss-no-print`
