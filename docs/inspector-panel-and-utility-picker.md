# Inspector Panel And Utility Picker

Phase 19 extends the reference builder with a right-side inspector panel.

The inspector lives in:

```text
examples/element-tree-builder.html
```

It edits the selected element from the tree or canvas and saves through the Phase 17 backend mutation endpoint.

## Inspector Sections

The reference panel includes:

- selected element summary
- quick label and text editing
- content fields for URL, image source, and alt text
- custom class field
- curated SS utility picker
- safe advanced attributes
- visibility, lock, duplicate, move, and delete actions

When no element is selected, controls are disabled. When a selected element is locked, normal edit controls are disabled but the unlock control remains available.

## Content Editing

The first reference controls target common fields:

- headings and paragraphs: `text`
- buttons and links: `text`, `href`
- images: `src`, `alt`
- cards: `title`, `text`

The backend validates the resulting page tree before saving. Unsafe URLs such as `javascript:` are rejected by tree validation.

## SS Utility Picker

The utility picker uses a curated allowlist:

- text alignment
- muted text
- surface and primary-soft backgrounds
- spacing
- radius
- shadow
- grid/flex display

The picker replaces conflicting classes within the same small group before saving. The backend still validates class syntax.

## Safe Attributes

Advanced attributes are limited to:

- `id`
- `title`
- `aria-label`

Backend validation rejects event handler attributes and unsupported attribute names.

## Save Behavior

The reference implementation uses manual save buttons. After a successful backend mutation, the UI reloads the latest tree, preserves the selected element when possible, and updates the canvas from backend data.

## Limitations

This is not a full production inspector. It intentionally avoids arbitrary inline styles, rich text editing, asset uploads, and arbitrary JavaScript. Phase 20 adds drag/drop structure editing.
