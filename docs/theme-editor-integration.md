# Theme Editor Integration

The theme editor example connects the optional Phase 11 theme settings backend to a builder-style UI. It is a reference workflow for a future SloanSites builder app, not a dependency for published websites.

Open the editor at:

```text
examples/theme-editor.html
```

Start the backend first:

```bash
cd server/theme-settings
npm install
npm run dev
```

The backend defaults to `http://localhost:3004`.

## Workflow

The editor uses the backend API to:

- list available sites
- create a demo site when no site exists
- load a site's `settings.json`
- preview changes immediately inside a scoped `.ss-client-theme` wrapper
- save validated settings back through the backend
- save site-specific `custom.css`
- keep custom JS disabled unless explicitly enabled
- rebuild the generated site `theme.css`

Live preview changes are unsaved until the user presses the save button. The preview works by applying SS CSS custom properties to the preview wrapper. It does not rewrite `src/ss.css`, `dist/ss.css`, or any generated `theme.css`.

## Saved Settings And Generated CSS

`settings.json` is the editable source of truth. The generated `theme.css` is output built from those settings.

Published sites should keep this CSS order:

```html
<link rel="stylesheet" href="/dist/ss.css">
<link rel="stylesheet" href="/sites/example-site/theme.css">
<link rel="stylesheet" href="/sites/example-site/custom.css">
```

The base framework CSS loads first. Generated theme CSS maps the saved site settings into scoped variables. Custom CSS, when enabled and valid, loads after both files.

## Custom CSS

Custom CSS is stored per site by the backend and is separate from the framework source and distribution files. Use it for client-specific adjustments that cannot be expressed through theme settings.

Avoid broad selectors that can unintentionally override generated layouts. The backend remains responsible for final size and safety validation.

## Custom JS

Custom JS is present in the example as an advanced field, but editing is disabled by default and saved JS is not executed in the theme editor preview. Phase 13 hardens this behavior with backend configuration and access checks.

Future preview execution should use an explicit safe mode, a sandboxed iframe, and production Content Security Policy rules.

## Reusing The Pattern

A future SloanSites builder app can reuse this pattern by keeping the same boundary:

- the builder UI reads and writes through backend routes
- the live preview uses scoped CSS variables
- backend validation is the source of truth
- generated theme CSS remains separate from base SS CSS
- published pages do not depend on the builder UI

The reference page intentionally uses SS CSS classes rather than another frontend framework so the integration stays close to the framework's published output.
