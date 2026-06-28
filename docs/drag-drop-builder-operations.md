# Drag Drop Builder Operations

Phase 20 adds reference drag-and-drop behavior to `examples/element-tree-builder.html`.

The builder still uses page JSON and backend validation as the source of truth. Dragging only proposes an operation; the backend commits or rejects it.

## Drag Sources

The reference UI supports:

- existing element tree rows
- new elements from the draggable element library

Locked elements and the page root cannot be dragged.

## Drop Targets

The reference UI accepts drops on tree rows and canvas nodes. It attempts:

- inside the target when the registry allows the target to contain the dragged type
- after the target when the target parent can contain the dragged type

The backend performs final validation through the Phase 17 mutation endpoint.

## Visual Feedback

Drop targets receive visible valid or invalid outlines while dragging. Invalid drops show an error message and do not modify local JSON.

## Backend Flow

New library item drop:

```json
{ "operation": "add", "elementType": "heading", "parentId": "hero-section", "position": "inside" }
```

Existing element drop:

```json
{ "operation": "move", "elementId": "hero-heading", "targetParentId": "hero-section", "siblingId": "hero-text", "position": "after" }
```

After a successful drop, the UI reloads the tree and canvas from the backend.

## Keyboard Fallback

Drag-and-drop is not the only editing path. The UI still includes:

- add inside/before/after buttons
- move up/down buttons
- duplicate and delete buttons
- inspector save buttons

## Current Limitations

This is a reference implementation. Tree and library drag are prioritized. Canvas drops are supported at a practical level through element IDs, but advanced auto-scroll, touch gestures, and deeply nested layout nodes are future work.

## Verification Checklist

- Drag an element tree row to another valid location.
- Drag a locked element and confirm dragging is blocked.
- Drag a library heading into a section.
- Try dropping onto an invalid target and confirm an error appears.
- Confirm backend rejection reloads the latest tree.
- Confirm tree and canvas selection remain synced after drop.
- Confirm move up/down buttons still work as keyboard fallback.
- Publish and confirm reordered content appears in output.
