# Phase 03 — Components, Form Controls, Navigation, and UI Patterns
Continue from Phases 01 and 02.
This phase must focus on reusable CSS components.
Do not add JavaScript behavior.
Do not use external CSS frameworks.
Do not copy Bootstrap source code.
Components should be class-based and easy to compose with the utility system.
## Main Goal
Build a practical component layer for the CSS framework.
The framework should now support common website, admin dashboard, SaaS, and app interface needs.
Focus on polished defaults, accessibility, consistent spacing, and clean color usage.
## Required Output Files
Update the main framework CSS file.
Update documentation with component guidance.
Add a changelog entry for Phase 03.
If a demo page exists, update it to show the components.
Keep examples lightweight.
## Component Design Rules
Use the official color palette from Phase 01.
Use layout and utility foundations from Phase 02.
Use consistent padding, radius, borders, shadows, and focus states.
Make components look good by default.
Make variants predictable.
Avoid overly specific project styling.
Do not rely on JavaScript for basic appearance.
## Button System
Create a button component with strong defaults.
Support primary, secondary, accent, success, warning, danger, info, ghost, soft, outline, and link-style variants.
Support sizes such as small, default, large, and icon-only.
Support disabled and loading visual states.
Ensure focus states are clear.
Ensure hover and active states are polished.
Make buttons work on anchors, buttons, and form controls where reasonable.
## Badge System
Create badges for labels, status indicators, counts, and small metadata.
Support neutral, primary, accent, success, warning, danger, and info variants.
Include soft badge styles.
Include pill badge styles.
Keep badges readable at small sizes.
## Alert System
Create alerts for info, success, warning, danger, accent, and neutral messages.
Use soft background colors.
Use clear borders and readable text.
Allow optional titles and descriptions.
Do not require icons.
Make alerts useful without JavaScript.
## Card System
Create a flexible card component.
Support card header, body, footer, title, subtitle, media, and actions.
Cards should use surface color, border color, radius, and subtle shadows.
Include flat, bordered, elevated, and interactive card styles.
Interactive cards need clear hover and focus behavior.
## Form Controls
Create polished form styles.
Support text inputs, email inputs, password inputs, number inputs, search inputs, selects, textareas, checkboxes, radios, switches, range inputs, file inputs, labels, help text, validation text, and field groups.
Use visible focus states.
Support disabled, readonly, valid, invalid, and warning states.
Use danger color for invalid states.
Use success color for valid states.
Keep form fields readable and easy to scan.
## Input Groups
Create input group patterns for prefixes, suffixes, buttons, and compact search bars.
Ensure border radius and borders merge cleanly.
Keep focus states visible even inside groups.
## Tables
Create table styles for data-heavy pages.
Support basic, striped, hoverable, bordered, compact, and responsive table variants.
Use neutral borders and soft backgrounds.
Make table headers distinct.
Avoid overly dark table styling in light mode.
## Navigation
Create navigation classes for horizontal navs, vertical navs, tabs, pills, breadcrumbs, and simple navbar layouts.
Do not add interactive JavaScript.
Use active, hover, disabled, and focus states.
Make navigation work well with both light and dark surfaces.
## Dropdown Appearance
Create visual styles for dropdown menus.
Do not implement JavaScript opening or closing logic.
Style dropdown containers, items, dividers, headers, disabled items, and active items.
Make dropdowns use surface colors, borders, radius, and overlay shadows.
## Modal and Overlay Appearance
Create visual styles for modal dialogs and overlays.
Do not implement JavaScript behavior.
Style modal backdrop, modal container, modal header, modal body, modal footer, and close button.
Use overlay colors from the official palette.
Ensure modal content is visually separated and readable.
## Toast and Notification Appearance
Create toast styles for small notifications.
Support neutral, success, warning, danger, and info variants.
Do not implement JavaScript behavior.
Use clear borders, surfaces, and shadows.
## Progress and Loading
Create progress bar styles.
Support neutral, primary, success, warning, and danger variants.
Create spinner or loader visual styles only if it can be done with CSS alone.
Respect reduced motion preferences.
## Skeleton Loading
Create skeleton loading styles for cards, text blocks, avatars, and rows.
Use subtle neutral colors.
Respect reduced motion preferences.
Do not make skeleton animation aggressive.
## Accordion Appearance
Create accordion visual styles.
Do not implement JavaScript behavior.
Style accordion item, header, trigger, content, and active/open appearance.
Make focus and hover states clear.
## List Groups
Create list group styles for menus, settings panels, inboxes, and simple data lists.
Support active, disabled, hover, bordered, and flush variants.
Use neutral surfaces and borders.
## Avatars
Create avatar styles for user initials, images, and small profile elements.
Support common sizes.
Support circle and rounded square shapes.
Use accent or primary soft backgrounds for fallback initials.
## Component Variants
Use consistent variant naming across components.
Primary means main action.
Secondary means neutral action.
Accent means highlighted or branded special state.
Success means positive state.
Warning means caution.
Danger means destructive or error state.
Info means informational state.
## Accessibility Requirements
Ensure all interactive-looking components have visible focus states.
Ensure disabled states look disabled but remain readable.
Ensure color is not the only visual cue for validation or status.
Ensure components work with semantic HTML.
Do not use CSS that hides focus outlines without replacement.
## Documentation Requirements
Document every component created in this phase.
Explain each component purpose.
List supported variants and sizes.
Mention any behavior that requires future JavaScript but is intentionally not implemented now.
Keep documentation concise.
## Quality Checklist
Buttons are complete and accessible.
Badges, alerts, cards, forms, tables, navs, dropdowns, modals, toasts, progress, skeletons, accordions, list groups, and avatars are styled.
Components use the official palette consistently.
Components compose well with utilities.
No JavaScript was added.
No external framework was added.
No Bootstrap source code was copied.
Phase 03 documentation exists.
Phase 03 changelog entry exists.
