# Builder Usage Guide

This guide describes how the SloanSites builder should structure SS CSS markup.

## Shell

Use Phase 08 classes for the editor application:

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

The app shell is editor UI. Published client sites should not depend on it.

## Canvas

Use Phase 05 classes inside the canvas:

```html
<main class="ss-builder-canvas ss-builder-canvas-dot-grid">
  <div class="ss-builder-stage">
    <div class="ss-builder-viewport" data-ss-device="desktop">
      <div class="ss-builder-page">
        ...
      </div>
    </div>
  </div>
</main>
```

Use `data-ss-device` or `.ss-builder-device-*` classes for desktop, laptop, tablet, mobile, mobile-narrow, and full-width previews.

## Editable Blocks

Generated website regions can use:

- `.ss-builder-section`
- `.ss-builder-block`
- `.ss-builder-container`
- `.ss-builder-inline`
- `.ss-builder-image`
- `.ss-builder-text`
- `.ss-builder-embed`
- `.ss-builder-editable`

Apply state classes such as `.ss-is-selected`, `.ss-is-hovered`, `.ss-is-dragging`, `.ss-is-drop-inside`, `.ss-is-locked`, `.ss-is-hidden`, `.ss-is-invalid`, and `.ss-is-empty` while editing.

## Modes

- `data-ss-builder-mode="edit"` shows handles, outlines, drop zones, and placeholders.
- `data-ss-builder-mode="preview"` keeps the device preview but hides editing controls.
- `data-ss-builder-mode="published"` strips visual editor chrome.
- `data-ss-published="true"` is the published-output defensive wrapper.

## Sections And Themes

Insert website sections with `.ss-section-*` classes inside editable sections. Apply client branding with `.ss-client-theme` or `[data-ss-client-theme]` at the site, page, preview, or section level.

## Published Output

Before publishing, remove builder app UI if possible. If some editor classes remain, use `.ss-published` or `[data-ss-published="true"]` to neutralize handles, drop zones, outlines, inspector panels, layer trees, asset browsers, and theme preview cards.
