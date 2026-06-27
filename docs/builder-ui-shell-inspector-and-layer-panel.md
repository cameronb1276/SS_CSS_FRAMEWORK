# Builder UI Shell, Inspector, and Layer Panel

Phase 08 adds CSS for the SloanSites builder application UI around the page canvas. These classes are editor-facing and should not be required by published client websites.

## App Shell

Use `.ss-builder-app` for the full viewport editor, `.ss-builder-topbar` for the top toolbar, `.ss-builder-app-main` for the main three-column layout, and `.ss-builder-statusbar` for bottom save/publish status.

```html
<div class="ss-builder-app">
  <header class="ss-builder-topbar">...</header>
  <div class="ss-builder-app-main">
    <aside class="ss-builder-sidebar">...</aside>
    <main class="ss-builder-canvas">...</main>
    <aside class="ss-builder-inspector">...</aside>
  </div>
  <footer class="ss-builder-statusbar">...</footer>
</div>
```

Collapsed states can use `.ss-builder-app-main-collapsed-left`, `.ss-builder-app-main-collapsed-right`, `.ss-builder-sidebar-collapsed`, `.ss-builder-inspector-collapsed`, `.ss-builder-panel-collapsed`, and hidden/overlay variants.

## Toolbar

Toolbar classes include `.ss-builder-toolbar-group`, `.ss-builder-topbar-group`, `.ss-builder-toolbar-divider`, `.ss-builder-project`, `.ss-builder-project-name`, `.ss-builder-page-selector`, `.ss-builder-device-switcher`, `.ss-builder-device-button`, `.ss-builder-device-button-active`, `.ss-builder-preview-actions`, `.ss-builder-publish-actions`, and `.ss-builder-account-menu`.

Status helpers include `.ss-builder-status`, `.ss-builder-status-saved`, `.ss-builder-status-saving`, `.ss-builder-status-unsaved`, `.ss-builder-status-publish-ready`, `.ss-builder-status-publishing`, `.ss-builder-status-published`, `.ss-builder-status-failed`, and `.ss-builder-status-offline`.

## Sidebar And Components

Use `.ss-builder-sidebar-header`, `.ss-builder-sidebar-body`, and `.ss-builder-sidebar-footer` for panel structure. Component library items use `.ss-builder-category`, `.ss-builder-category-title`, `.ss-builder-component-item`, `.ss-builder-component-icon`, `.ss-builder-component-title`, and `.ss-builder-component-desc`.

State classes include active, selected, dragging, disabled, and locked variants.

## Inspector Controls

The inspector uses `.ss-builder-inspector`, `.ss-builder-inspector-header`, `.ss-builder-inspector-body`, `.ss-builder-property-group`, `.ss-builder-control-group`, `.ss-builder-control-row`, `.ss-builder-control-label`, `.ss-builder-control-value`, `.ss-builder-control-grid`, `.ss-builder-control-segmented`, `.ss-builder-segment`, `.ss-builder-compact-input`, and `.ss-builder-reset-button`.

Swatches use `.ss-builder-swatch-grid`, `.ss-builder-swatch`, `.ss-builder-swatch-active`, `.ss-builder-swatch-empty`, `.ss-builder-swatch-custom`, `.ss-builder-swatch-transparent`, and `.ss-builder-swatch-brand`.

Spacing controls use `.ss-builder-spacing-box`, `.ss-builder-spacing-top`, `.ss-builder-spacing-right`, `.ss-builder-spacing-bottom`, `.ss-builder-spacing-left`, `.ss-builder-spacing-center`, `.ss-builder-spacing-linked`, and `.ss-builder-spacing-chips`.

Typography controls can use `.ss-builder-typography-row` and `.ss-builder-text-style-chips`.

## Layer Tree And Pages

Layer trees use `.ss-builder-layer-list`, `.ss-builder-layer-row`, `.ss-builder-layer-icon`, `.ss-builder-layer-actions`, plus `.ss-builder-layer-selected`, `.ss-builder-layer-hidden`, `.ss-builder-layer-locked`, `.ss-builder-layer-invalid`, `.ss-builder-layer-dragging`, and `.ss-builder-layer-drop-target`.

Nested rows set `--ss-layer-depth` inline or through app-generated classes.

Page lists use `.ss-builder-page-list`, `.ss-builder-page-item`, `.ss-builder-page-title`, `.ss-builder-page-actions`, `.ss-builder-page-item-active`, `.ss-builder-page-item-draft`, `.ss-builder-page-item-published`, `.ss-builder-home-marker`, and `.ss-builder-add-page-row`.

## Assets And Mini Previews

Asset browser classes include `.ss-builder-asset-grid`, `.ss-builder-asset-card`, `.ss-builder-asset-thumb`, `.ss-builder-asset-icon`, `.ss-builder-asset-title`, `.ss-builder-asset-meta`, `.ss-builder-asset-card-selected`, `.ss-builder-upload-drop`, and `.ss-builder-empty-assets`.

Mini previews use `.ss-builder-mini-preview-card`, `.ss-builder-mini-preview`, `.ss-builder-mini-preview-line`, `.ss-builder-mini-preview-block`, `.ss-builder-mini-preview-card-selected`, `.ss-builder-pro-badge`, and `.ss-builder-locked-badge`.

## Published Site Rule

Published websites should remove builder UI markup. Phase 09 adds stronger defensive cleanup, but even in Phase 08 the builder app UI is intentionally separated from `.ss-section-*`, `.ss-card`, `.ss-form`, `.ss-navbar`, and other published-site classes.
