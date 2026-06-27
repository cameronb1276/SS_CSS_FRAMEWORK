# SS CSS Framework 0.2.0

SS CSS Framework `0.2.0` packages the foundation framework plus the SloanSites builder, section, theme, and published-site safety layers.

## Release Files

- `src/ss.css`: readable source CSS.
- `dist/ss.css`: drop-in readable distribution CSS.
- `dist/ss.min.css`: drop-in minified distribution CSS.
- `examples/demo.html`: full visual demo.
- `docs/index.html`: static documentation entry point.
- `docs/class-reference.md`: category-based class reference.

## Included

- Foundation tokens and class-based base styles.
- Responsive layout and utility classes.
- Common component and UI pattern styles.
- Light mode, explicit dark mode, and optional system dark mode.
- Builder canvas and editable-state primitives for SloanSites editor surfaces.
- Website section and local-business pattern primitives for generated client pages.
- Client theme wrappers, brand variables, and preset theme helpers.
- Builder app UI shell, inspector, layer panel, asset browser, and status styles.
- Published-site hardening utilities for messy content, media, embeds, tables, forms, navigation, and print.
- Documentation and examples.

## Not Included

- JavaScript behavior for interactive components.
- Build tooling.
- Legacy browser support.

## Recommended Use

Link `dist/ss.min.css` in production and `dist/ss.css` while developing or inspecting the framework.

## Release Checklist

- Source and distribution CSS are synchronized.
- Example pages cover foundation, layout, components, sections, builder canvas, builder UI, themes, and published safety.
- Documentation covers tokens, utilities, components, sections, builder usage, client themes, and published output.
- `instructions/` is a local ignored working folder and is not part of the GitHub release package.
