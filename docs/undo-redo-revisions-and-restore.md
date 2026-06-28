# Undo Redo Revisions And Restore

Phase 21 adds snapshot-based recovery for builder edits.

The implementation favors reliability over complex inverse operations. Before every successful element mutation, the backend stores the previous page JSON as a revision snapshot. Undo and redo restore snapshots.

## Storage Layout

Runtime history is stored under each site folder:

```text
data/sites/<site-id>/
  revisions/
    <page-id>/
      <revision-id>.json
      <revision-id>.meta.json
  redo/
    <page-id>/
      <redo-id>.json
      <redo-id>.meta.json
```

Revision metadata includes site ID, page ID, operation, target element ID when available, actor, summary, and timestamp.

The backend retains the newest 20 revisions per page.

## API Routes

List revisions:

```text
GET /api/sites/:siteId/pages/:pageId/revisions
```

Undo:

```text
POST /api/sites/:siteId/pages/:pageId/undo
```

Redo:

```text
POST /api/sites/:siteId/pages/:pageId/redo
```

Restore:

```text
POST /api/sites/:siteId/pages/:pageId/revisions/:revisionId/restore
```

All write routes use the existing auth, JSON content, rate limit, validation, backup, and audit layers.

## Undo And Redo

Undo restores the newest revision snapshot for the current site and page. Before restoring, the current page is saved to the redo stack.

Redo restores the newest redo snapshot. A future implementation can clear redo on new branch edits; this reference version keeps the stack simple for local JSON workflows.

## Revision Restore

Restore validates the selected revision JSON before replacing the current page. The current page is still backed up through the existing page backup path.

Invalid revision IDs or invalid JSON are rejected.

## Trash Behavior

Element delete remains active-tree removal. The deleted subtree is recoverable through undo or revision restore. A separate trash panel and permanent-delete workflow can be layered on later if the builder needs item-level trash management.

## UI

`examples/element-tree-builder.html` includes:

- Undo button
- Redo button
- Revision history loader
- Restore revision buttons
- Clear status messages

## Known Limits

Snapshots are local files, not cloud backups. There is no visual diff, collaboration conflict resolution, or unlimited history. This phase is intended to make local builder editing forgiving and recoverable.
