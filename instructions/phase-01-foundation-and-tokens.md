# Phase 01 — Foundation, Color Tokens, Reset, and Base Styles

You are building a general-purpose CSS framework similar in spirit to Bootstrap, but with a cleaner modern color system and a more polished default look.

This phase must focus only on the foundation layer.

Do not build the full component library yet.

Do not add JavaScript.

Do not use external CSS frameworks.

Do not copy Bootstrap source code.

Create original class names and structure.

The final framework should be easy to use by dropping one CSS file into a project.

## Main Goal

Create the foundation for the CSS framework.

This includes color variables, typography defaults, spacing scale, border radius scale, shadows, reset styles, and base HTML element styling.

## Required Output Files

Create or update the main framework CSS file.

Create a small documentation markdown file explaining the foundation choices.

Create a changelog entry for Phase 01.

Use clear names so future phases can build on this work.

## Color Scheme

Use this color scheme as the official framework palette.

Primary: #3B82F6

Primary Hover: #2563EB

Secondary: #64748B

Accent: #A855F7

Success: #22C55E

Warning: #F59E0B

Danger: #EF4444

Info: #06B6D4

Background: #F8FAFC

Surface: #FFFFFF

Surface Soft: #F1F5F9

Border: #CBD5E1

Text Main: #0F172A

Text Muted: #475569

Text Soft: #94A3B8

Text Inverted: #FFFFFF

Dark Background: #0B1120

Dark Surface: #111827

Dark Surface Soft: #1E293B

Dark Border: #334155

Overlay Light: rgba(15, 23, 42, 0.08)

Overlay Medium: rgba(15, 23, 42, 0.18)

Overlay Dark: rgba(15, 23, 42, 0.65)

Primary Soft: rgba(59, 130, 246, 0.12)

Accent Soft: rgba(168, 85, 247, 0.12)

Success Soft: rgba(34, 197, 94, 0.12)

Warning Soft: rgba(245, 158, 11, 0.14)

Danger Soft: rgba(239, 68, 68, 0.12)

## Design Direction

The framework should feel modern, professional, clean, and useful for business websites, dashboards, admin panels, SaaS pages, and client websites.

Avoid overly playful colors.

Avoid harsh contrast except where needed for accessibility.

Use the blue primary color as the main action color.

Use the purple accent color sparingly for highlights, badges, callouts, and special UI areas.

Use neutral slate colors for text, borders, surfaces, and secondary actions.

## CSS Variable System

Create a clear token system using CSS custom properties.

Token groups should include colors, typography, spacing, radius, shadows, transitions, z-index, and layout widths.

Use semantic token names instead of only raw color names.

Examples of semantic token purposes: background, surface, text, muted text, border, primary, danger, success, warning, info, accent.

Include hover, active, disabled, and soft background token values where useful.

Include light theme tokens first.

Add dark theme tokens in a way that future phases can support dark mode easily.

Do not make dark mode the default.

## Reset and Normalization

Create a simple modern reset.

Use border-box sizing globally.

Remove default body margin.

Set good defaults for images, SVGs, buttons, inputs, tables, and forms.

Make media elements responsive by default.

Avoid aggressive resets that break third-party content.

## Typography Foundation

Use a system font stack.

Do not import external fonts.

Set a clean base font size, line height, and text color.

Create sensible defaults for headings, paragraphs, links, lists, blockquotes, code text, and horizontal rules.

Make headings visually distinct but not oversized.

Make links use the primary color and a clear hover state.

Make body text readable on both light and dark backgrounds.

## Spacing Scale

Create a spacing scale that can be reused by future utility classes.

Use consistent increments suitable for modern UI.

Include very small, small, medium, large, extra-large, and section-level spacing tokens.

Keep the scale simple enough to remember.

## Radius Scale

Create radius tokens for none, small, medium, large, extra-large, pill, and full circle.

Use medium or large rounding as the default visual style.

Avoid making every element look overly rounded.

## Shadow System

Create subtle shadows for cards, dropdowns, modals, and floating elements.

Use soft shadows that work with the chosen neutral palette.

Avoid heavy black shadows.

Use shadow levels such as small, medium, large, and overlay.

## Transition System

Create transition tokens for fast, normal, and slow interactions.

Use smooth easing.

Apply transitions only where helpful.

Avoid excessive animation.

Respect reduced motion preferences.

## Base Elements

Style common HTML elements in a clean, framework-friendly way.

Base styles should include body, headings, paragraphs, links, buttons, inputs, selects, textareas, labels, tables, images, figures, blockquotes, code, preformatted text, and horizontal rules.

Keep base element styles minimal so component classes can override them later.

## Accessibility Requirements

Maintain strong text contrast.

Ensure focus states are visible.

Use focus outlines that match the primary color.

Do not remove focus outlines unless replacing them with an accessible alternative.

Support keyboard navigation visually.

Respect prefers-reduced-motion.

## Naming Direction

Use short but readable class names.

Avoid copying Bootstrap class names exactly where possible.

Prefer a consistent prefix only if it improves clarity.

Do not make class names overly long.

Keep future utility classes predictable.

## Quality Checklist

The framework foundation loads correctly as a single CSS file.

The color system is centralized with CSS variables.

The page background, surface, border, and text colors are consistent.

Base typography looks clean without extra classes.

Focus states are visible.

Reduced motion is respected.

No JavaScript was added.

No external dependency was added.

No Bootstrap code was copied.

Phase 01 documentation exists.

Phase 01 changelog entry exists.
