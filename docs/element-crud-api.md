# Element CRUD API

Phase 17 adds backend mutation operations for the builder element tree.

The frontend should not directly rewrite page JSON. It should send an operation request to the backend, which loads the current page JSON, validates the current element tree, applies the mutation in memory, validates the result, backs up the previous page file, writes the updated JSON atomically, and returns the updated page.

## Endpoint

```text
POST /api/sites/:siteId/pages/:pageId/element-operations
```

Requests use `Content-Type: application/json`.

## Supported Operations

The first operation set supports:

- `add`
- `patch`
- `delete`
- `duplicate`
- `move`
- `rename`
- `set-visibility`
- `set-locked`

All operations validate site ID, page ID, element IDs, registered element types, class names, attributes, lock state, and parent/child rules.

## Add

Add a default element from the registry:

```json
{
  "operation": "add",
  "elementType": "heading",
  "parentId": "hero-section",
  "position": "inside",
  "newElementId": "hero-extra-heading"
}
```

`position` can be `inside`, `before`, or `after`. `inside` can use an optional `index`.

## Patch

Patch safe editable fields:

```json
{
  "operation": "patch",
  "elementId": "hero-heading",
  "patch": {
    "content": { "text": "Updated heading" },
    "classes": ["ss-text-center"],
    "attributes": { "aria-label": "Hero heading" }
  }
}
```

Patch can update label, content, design, custom classes, safe attributes, hidden state, and locked state. It cannot edit element IDs or move nodes.

## Delete

Delete removes the active element from page JSON. Deleting a parent removes its subtree for the active page. Page root cannot be deleted. Locked elements cannot be deleted.

Revision restore is added in a later phase; this phase relies on page backups before replacement.

## Duplicate

Duplicate deep-copies the selected section or block and generates safe copy IDs.

## Move

Move supports moving blocks before, after, or inside a target section. The backend rejects moving page root, moving locked elements, invalid targets, and unsupported parent/child relationships.

## Hide And Lock

`set-visibility` toggles the active hidden flag. Hidden elements remain in JSON but do not render in published output.

`set-locked` toggles the locked flag. Locked elements can still be selected but normal edit, delete, duplicate, and move operations are rejected.

## Backup And Audit

Every successful operation saves through the existing page update path, which creates a timestamped backup before replacement. The API writes an audit event named `element.mutated`.

## Current Scope

This phase supports full section-level insertion and block-level mutation for the existing Phase 14 storage model. Nested layout elements are represented in the registry and tree model, but deep nested storage is reserved for later builder storage expansion.
