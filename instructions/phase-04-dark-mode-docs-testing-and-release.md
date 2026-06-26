# Phase 04 — Dark Mode, Documentation, Testing, Polish, and Release Prep
Continue from Phases 01, 02, and 03.
This phase must focus on finishing the CSS framework into a usable first release.
Do not add JavaScript unless it is only for an optional demo page and not required by the framework CSS.
Do not use external CSS frameworks.
Do not copy Bootstrap source code.
The final result should feel like a polished lightweight alternative to Bootstrap.
## Main Goal
Finalize the framework by adding dark mode support, improving accessibility, cleaning naming consistency, testing responsive behavior, documenting usage, and preparing release files.
## Required Output Files
Finalize the main framework CSS file.
Create or update minified CSS output if the project has a build process.
Create or update a README for users.
Create or update a component documentation file.
Create or update a utility documentation file.
Create or update a changelog for Phase 04.
Create or update a simple demo page if one already exists.
## Dark Mode Goal
Add dark mode support using the dark palette from Phase 01.
Dark Background: #0B1120
Dark Surface: #111827
Dark Surface Soft: #1E293B
Dark Border: #334155
Text Inverted: #FFFFFF
Use dark mode in a way that is easy for developers to control.
Support a class-based dark mode strategy.
Optionally support system preference dark mode if it does not conflict with the class-based strategy.
Do not force dark mode on users.
## Dark Mode Quality
Ensure text contrast remains strong.
Ensure cards, forms, tables, navs, dropdowns, modals, alerts, and buttons look polished in dark mode.
Ensure borders are visible but not harsh.
Ensure shadows do not look muddy on dark backgrounds.
Use surfaces and borders instead of relying heavily on black shadows.
## Accessibility Review
Review the entire framework for accessibility issues.
Focus states must be visible in light and dark themes.
Disabled states must remain readable.
Validation states must not rely only on color.
Links must remain distinguishable.
Form controls must be keyboard-friendly.
Interactive-looking components must have focus styles.
Reduced motion preferences must be respected.
Do not remove semantic behavior from native elements.
## Responsive Testing
Test the framework visually at mobile, tablet, desktop, and wide desktop widths.
Check containers, grids, navs, cards, forms, tables, modals, and dashboards.
Ensure mobile layouts do not overflow horizontally.
Ensure tables have a responsive option.
Ensure spacing does not feel cramped on mobile or oversized on desktop.
## Browser Testing
Test in modern Chromium-based browsers.
Test in Firefox.
Test in Safari if available.
Use progressive enhancement where possible.
Avoid fragile browser-specific hacks.
Document any known browser limitations.
## Naming Consistency Review
Review all class names.
Make sure naming patterns are predictable.
Remove duplicate or confusing class names.
Avoid names that are too close to Bootstrap if a clearer original name is available.
Keep the framework easy to learn.
## File Organization Review
If the framework uses a single CSS file, organize sections clearly with comments.
If the framework uses source files, organize them into foundation, layout, utilities, components, themes, and docs.
Ensure the final distributable CSS can be used by itself.
Avoid requiring a build system unless the project already uses one.
## Documentation Requirements
Write a clear README.
Explain what the framework is.
Explain how to install or use the CSS file.
Explain the color palette.
Explain containers and grids.
Explain utility classes.
Explain components.
Explain dark mode.
Explain accessibility choices.
Explain browser support.
Explain how to customize tokens.
Keep the documentation useful but not bloated.
## Demo Page Requirements
Create or update a demo page that shows the framework visually.
Include typography, buttons, badges, alerts, cards, forms, tables, navs, dropdown appearance, modal appearance, toast appearance, progress bars, skeletons, list groups, avatars, grids, utilities, and dark mode examples.
The demo page should help visually confirm the framework is working.
The demo page should not be required to use the framework.
## Release Naming
Pick a simple framework name if the project does not already have one.
The name should feel general-purpose and professional.
Avoid names that conflict with Bootstrap, Tailwind, Bulma, Foundation, or other major CSS frameworks.
Use the name consistently in README, documentation, demo, and changelog.
## Versioning
Prepare the framework as version 0.1.0 unless the project already has a version.
Use semantic versioning going forward.
Document what is included in the first release.
Document known limitations.
## Performance Review
Keep the CSS reasonably lightweight.
Remove unused duplicated rules.
Avoid deeply nested selectors.
Avoid excessive universal selectors beyond the reset.
Avoid unnecessary animations.
Avoid huge utility explosions.
Make sure the CSS file is readable before minification.
## Maintainability Review
Keep variables centralized.
Keep repeated values tokenized where practical.
Group related styles together.
Use comments to separate major sections.
Avoid one-off classes that belong to a specific project.
Make future expansion easy.
## Final Quality Checklist
The framework works as a single CSS include.
The official color scheme is used consistently.
Light mode looks polished.
Dark mode looks polished.
Typography defaults are readable.
Containers and grids are responsive.
Utilities are useful and predictable.
Components are complete enough for common websites and dashboards.
Forms are accessible and clean.
Tables are readable and responsive.
Focus states are visible.
Reduced motion is respected.
Documentation is complete.
A demo page exists or has been updated.
No JavaScript is required for the CSS framework itself.
No external CSS framework was added.
No Bootstrap source code was copied.
Phase 04 changelog entry exists.
The project is ready for a first 0.1.0 release.
