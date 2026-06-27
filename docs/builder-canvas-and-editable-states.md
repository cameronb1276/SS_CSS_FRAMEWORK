# Builder Canvas and Editable States

Phase 05 adds website-builder primitives for visual page composition in the SloanSites builder. These styles are editor-facing and are separate from normal published website output.

## Architecture

Use `.ss-builder` or `.ss-builder-shell` for the editor app surface. The common structure is:

```html
<div class="ss-builder-shell" data-ss-builder-mode="edit">
  <header class="ss-builder-toolbar">...</header>
  <div class="ss-builder-workspace ss-builder-workspace-with-panels">
    <aside class="ss-builder-sidebar ss-builder-sidebar-left">...</aside>
    <main class="ss-builder-canvas ss-builder-canvas-dot-grid">
      <div class="ss-builder-stage">
        <div class="ss-builder-viewport" data-ss-device="desktop">
          <div class="ss-builder-page">...</div>
        </div>
      </div>
    </main>
    <aside class="ss-builder-panel ss-builder-panel-right">...</aside>
  </div>
</div>
```

## Modes

- `data-ss-builder-mode="edit"` shows handles, outlines, drop zones, placeholders, and editor overlays.
- `data-ss-builder-mode="preview"` keeps the preview frame and responsive device width but hides editing handles and drop zones.
- `data-ss-builder-mode="published"` removes builder chrome, outlines, handles, drop zones, overlays, and extra canvas spacing.
- `data-ss-published="true"` can be used as an equivalent published-output guard.

Published mode should not be used as the only publishing safety layer. The app should also avoid rendering editor-only state classes in live output whenever possible.

## Device Preview

Preview widths can be controlled with data attributes or classes:

- `data-ss-device="desktop"` or `.ss-builder-device-desktop`: about `1200px`.
- `data-ss-device="laptop"` or `.ss-builder-device-laptop`: about `1024px`.
- `data-ss-device="tablet"` or `.ss-builder-device-tablet`: about `768px`.
- `data-ss-device="mobile"` or `.ss-builder-device-mobile`: about `390px`.
- `data-ss-device="mobile-narrow"` or `.ss-builder-device-mobile-narrow`: about `360px`.
- `data-ss-device="full"` or `.ss-builder-device-full`: full width.

The builder stage is horizontally scrollable on small screens so narrow app viewports can still inspect larger page previews.

## Canvas Backgrounds

Canvas background helpers:

- `.ss-builder-canvas-plain`
- `.ss-builder-canvas-dot-grid`
- `.ss-builder-canvas-line-grid`
- `.ss-builder-canvas-checkerboard`

All use builder tokens and adapt in dark mode.

## Editable Elements

Use builder classes on generated website regions:

- `.ss-builder-section`
- `.ss-builder-block`
- `.ss-builder-container`
- `.ss-builder-inline`
- `.ss-builder-image`
- `.ss-builder-text`
- `.ss-builder-embed`
- `.ss-builder-editable`

These classes are intentionally generic enough for sections, grids, cards, images, rich text, embeds, and inline editing targets.

## States

State classes and data attributes are both supported:

- Hovered: `.ss-is-hovered` or `data-ss-state~="hovered"`
- Selected: `.ss-is-selected` or `data-ss-state~="selected"`
- Multi-selected: `.ss-is-multi-selected` or `data-ss-state~="multi-selected"`
- Parent selected: `.ss-is-parent-selected` or `data-ss-state~="parent-selected"`
- Child selected: `.ss-is-child-selected` or `data-ss-state~="child-selected"`
- Active editing: `.ss-is-active-editing` or `data-ss-state~="editing"`
- Dragging: `.ss-is-dragging` or `data-ss-state~="dragging"`
- Drag over: `.ss-is-drag-over` or `data-ss-state~="drag-over"`
- Locked: `.ss-is-locked` or `data-ss-state~="locked"`
- Hidden: `.ss-is-hidden` or `data-ss-state~="hidden"`
- Invalid: `.ss-is-invalid` or `data-ss-state~="invalid"`
- Missing: `.ss-is-missing` or `data-ss-state~="missing"`
- Empty: `.ss-is-empty` or `data-ss-state~="empty"`

Drop positions can be declared with `.ss-is-drop-before`, `.ss-is-drop-after`, `.ss-is-drop-inside`, or `data-ss-drop-position="before|after|inside"`.

## Drop Zones and Handles

Drop helpers include `.ss-builder-dropzone`, `.ss-builder-dropzone-active`, `.ss-builder-dropzone-invalid`, and `.ss-builder-drag-ghost`.

Handle classes include:

- `.ss-builder-handle`
- `.ss-builder-section-handle`
- `.ss-builder-block-handle`
- `.ss-builder-resize-handle`
- `.ss-builder-move-handle`
- `.ss-builder-duplicate-handle`
- `.ss-builder-delete-handle`
- `.ss-builder-lock-handle`
- `.ss-builder-visibility-handle`
- `.ss-builder-handle-bar`

The framework creates the visual boxes and placement hooks. The builder app can place icons inside these handles later.

## Empty and Missing Content

Use `.ss-builder-placeholder` inside empty states such as `.ss-builder-empty-section`, `.ss-builder-empty-container`, `.ss-builder-empty-text`, `.ss-builder-missing-image`, `.ss-builder-missing-embed`, `.ss-builder-missing-form`, `.ss-builder-empty-nav`, and `.ss-builder-empty-gallery`.

These placeholders are visible in edit mode but hidden or neutralized in published mode.

## Accessibility

The builder CSS keeps focus-visible outlines, readable dark mode colors, visible active drop targets, reduced motion support, and compact but usable handle targets. JavaScript should still manage semantic editor behavior such as keyboard selection, drag/drop announcements, and focus movement.
