# Phase 03 Components and Patterns

Phase 03 adds reusable CSS components for websites, dashboards, SaaS products, and app interfaces. Components are class-based, require no JavaScript, and compose with the Phase 01 tokens and Phase 02 utilities.

## Buttons

Use `.ss-btn` as the base button class. It works on semantic buttons, links, and compatible form controls.

Variants: `.ss-btn-secondary`, `.ss-btn-accent`, `.ss-btn-success`, `.ss-btn-warning`, `.ss-btn-danger`, `.ss-btn-info`, `.ss-btn-ghost`, `.ss-btn-soft`, `.ss-btn-outline`, and `.ss-btn-link`.

Sizes and states: `.ss-btn-sm`, `.ss-btn-lg`, `.ss-btn-icon`, `.ss-btn-loading`, disabled buttons, and `[aria-disabled="true"]`.

## Badges and Alerts

Badges use `.ss-badge` with variants for primary, accent, success, warning, danger, and info. Add `.ss-badge-soft` for soft status labels and `.ss-badge-pill` for rounded metadata.

Alerts use `.ss-alert` with `.ss-alert-info`, `.ss-alert-success`, `.ss-alert-warning`, `.ss-alert-danger`, and `.ss-alert-accent`. Use `.ss-alert-title` and `.ss-alert-desc` inside alerts for structured messages.

## Cards

Cards use `.ss-card`, with `.ss-card-header`, `.ss-card-body`, `.ss-card-footer`, `.ss-card-title`, `.ss-card-subtitle`, `.ss-card-media`, and `.ss-card-actions`.

Variants include `.ss-card-flat`, `.ss-card-bordered`, `.ss-card-elevated`, and `.ss-card-interactive`.

## Forms

Form controls extend the foundation classes with sizes and states:

- `.ss-field-sm`, `.ss-field-lg`, `.ss-field-valid`, `.ss-field-invalid`, `.ss-field-warning`, and `.ss-validate`.
- `.ss-help`, `.ss-valid-text`, `.ss-invalid-text`, and `.ss-warning-text`.
- `.ss-field-group`, `.ss-check`, `.ss-radio`, `.ss-switch`, `.ss-check-input`, `.ss-radio-input`, `.ss-switch-input`, `.ss-range`, and `.ss-file`.

Input groups use `.ss-input-group` or `.ss-search`, with `.ss-input-addon` for prefixes and suffixes.

## Tables

Start with `.ss-table`, `.ss-tr`, `.ss-th`, and `.ss-td`. Add `.ss-table-striped`, `.ss-table-hover`, `.ss-table-bordered`, `.ss-table-compact`, or wrap wide tables in `.ss-table-responsive`.

## Navigation

Navigation patterns include `.ss-nav`, `.ss-nav-vertical`, `.ss-tabs`, `.ss-pills`, `.ss-breadcrumb`, and `.ss-navbar`.

Use `.ss-nav-link`, `.ss-tab`, `.ss-pill`, `.ss-breadcrumb-link`, `.ss-navbar-brand`, and `.ss-navbar-link` for items. Active and disabled classes use the same pattern, such as `.ss-tab-active` and `.ss-nav-link-disabled`.

These styles do not implement interactive behavior such as tab switching or menu toggles.

## Dropdowns, Modals, and Toasts

Dropdown appearance includes `.ss-dropdown`, `.ss-dropdown-header`, `.ss-dropdown-item`, `.ss-dropdown-item-active`, `.ss-dropdown-item-disabled`, and `.ss-dropdown-divider`.

Modal appearance includes `.ss-modal-backdrop`, `.ss-modal`, `.ss-modal-header`, `.ss-modal-body`, `.ss-modal-footer`, `.ss-modal-title`, and `.ss-close`.

Toasts use `.ss-toast` with `.ss-toast-success`, `.ss-toast-warning`, `.ss-toast-danger`, and `.ss-toast-info`.

These are visual styles only. Opening, closing, focus trapping, tab behavior, and dismissal require future JavaScript or server-rendered state.

## Progress, Loading, and Skeletons

Progress bars use `.ss-progress` and `.ss-progress-bar`, with the width set by `--ss-progress-value`. Variants include `.ss-progress-neutral`, `.ss-progress-success`, `.ss-progress-warning`, and `.ss-progress-danger`.

Loading helpers include `.ss-spinner` and `.ss-btn-loading`. Skeletons use `.ss-skeleton`, `.ss-skeleton-text`, `.ss-skeleton-title`, `.ss-skeleton-avatar`, `.ss-skeleton-card`, and `.ss-skeleton-row`.

Animations respect `prefers-reduced-motion`.

## Accordions, List Groups, and Avatars

Accordions use `.ss-accordion`, `.ss-accordion-item`, `.ss-accordion-trigger`, `.ss-accordion-content`, and `.ss-accordion-open`. No expand/collapse JavaScript is included.

List groups use `.ss-list-group`, `.ss-list-group-flush`, `.ss-list-item`, `.ss-list-item-hover`, `.ss-list-item-active`, and `.ss-list-item-disabled`.

Avatars use `.ss-avatar`, with `.ss-avatar-sm`, `.ss-avatar-lg`, `.ss-avatar-xl`, `.ss-avatar-rounded`, and `.ss-avatar-accent`.
