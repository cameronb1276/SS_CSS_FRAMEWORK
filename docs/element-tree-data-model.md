# Element Tree Data Model

Phase 16 defines the canonical editable element tree used by the SloanSites builder backend.

Page JSON remains the source of truth. The live DOM is only a render target. The builder should read page JSON, normalize it into an element tree, render the tree and canvas from that same data, send mutations back to the backend, and publish static HTML from validated JSON.

## Element Node

An element node includes:

- stable `elementId`
- human-readable `label`
- `type`
- `parentId`
- ordered `children`
- `content`
- safe `design` presets
- system and custom class lists
- safe HTML attributes
- visibility and locked state
- optional trash state
- builder metadata

Existing Phase 14 pages are normalized into this model. Page roots become `page-root`, sections become `section`, and section blocks become their closest element type such as `heading`, `paragraph`, `button`, `image`, `card`, `form`, or `map-embed`.

## Registry

The element registry is the single source for allowed builder element types. It defines:

- category
- allowed parents
- allowed children
- whether the element can have children
- default content
- default design
- default SS CSS classes
- editable fields
- required fields
- render category
- published-output safety
- builder-only state

The registry lives in the optional backend under `server/theme-settings/src/registry/elementRegistry.ts`.

## Parent And Child Rules

The validator prevents broken structures:

- `page-root` can contain sections and top-level safe blocks.
- `section` can contain layout and content elements.
- layout elements such as `container`, `grid`, `stack`, `cluster`, `split`, `card`, and `group` can contain normal content.
- leaf elements such as `heading`, `paragraph`, `image`, `input`, and `textarea` cannot have children.
- `form` can contain form fields and submit buttons.
- `nav` can contain `nav-link`.
- builder-only and unsafe advanced elements are flagged for published output.

## Class And Attribute Safety

Class lists are split into system classes and custom classes. Validation rejects empty, duplicate, or malformed class names.

Attributes are limited to safe fields such as `id`, `title`, `aria-*`, and approved `data-ss-*` attributes. Event handler attributes such as `onclick` are rejected. Links and media sources should live in explicit content fields wherever possible.

## Compatibility

Existing Phase 14 page JSON still loads. The backend provides a compatibility adapter instead of forcing an immediate storage migration. Future phases can use the normalized tree for selection, inspector editing, drag/drop, history, and publish validation while preserving the readable page JSON files.

## API

Read the registry:

```text
GET /api/element-registry
```

Read a normalized page tree:

```text
GET /api/sites/:siteId/pages/:pageId/tree
```

The tree response includes validation issues so a future UI can display invalid, unsafe, or builder-only nodes.

## Publish Flow

The Phase 15 static publish pipeline still renders from page JSON. Phase 16 adds a validation layer that can check the same page JSON as an element tree before publishing or editing.

## Verification

The backend verification now checks:

- default page tree validation
- registry endpoint
- page tree endpoint
- duplicate element ID rejection
- invalid nesting rejection
- unsafe attribute rejection
- malformed class rejection
- required content field detection
- published-safety detection for builder-only elements
