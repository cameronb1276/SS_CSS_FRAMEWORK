# Element Tree UI

Phase 18 adds a reference builder interface at:

```text
examples/element-tree-builder.html
```

The page demonstrates how a future SloanSites builder can render page JSON as an element tree, render the same data into a canvas preview, and send all edits through the backend mutation API.

## Backend Flow

The UI uses:

- `GET /api/element-registry`
- `GET /api/sites`
- `GET /api/sites/:siteId/pages`
- `GET /api/sites/:siteId/pages/:pageId/tree`
- `POST /api/sites/:siteId/pages/:pageId/element-operations`

Frontend JavaScript never rewrites JSON files directly.

## Tree To Canvas Selection

Each tree row and each canvas node is keyed by the backend `elementId`.

Selecting a tree row:

- marks the row selected
- selects the matching canvas node
- updates the selected-element panel

Selecting a canvas node:

- selects the matching tree item
- updates quick controls

Locked nodes remain selectable, but backend operations reject unsafe edits.

## CRUD Controls

The reference UI includes:

- add inside selected element
- add before selected element
- add after selected element
- rename
- basic text edit
- custom class edit
- duplicate
- delete with confirmation
- hide/show
- lock/unlock
- move up/down among siblings

Backend validation is the source of truth. Invalid parent/child requests, unsafe classes, locked element edits, and unsupported moves show error messages from the API.

## Current Limitations

This is a focused reference UI, not a final production builder. It keeps a compact renderer, simple confirmations, and button-based move controls. Full inspector controls are handled in Phase 19, and drag/drop behavior is handled in Phase 20.

## Verification Checklist

- Start `server/theme-settings` on port `3004`.
- Open `examples/element-tree-builder.html`.
- Create or select `element-tree-demo`.
- Confirm the nested tree appears.
- Select an element in the tree and confirm canvas selection changes.
- Select an element in the canvas and confirm tree/inspector state changes.
- Add a heading to a section.
- Try adding a section inside a heading and confirm the backend rejects it.
- Rename an element.
- Edit heading text.
- Hide/show an element.
- Lock an element and confirm normal edits are rejected.
- Duplicate an element.
- Move an element up/down.
- Delete an element with confirmation.
- Publish and confirm builder-only UI does not appear in output.
