# Website Sections and Local Business Patterns

Phase 06 adds reusable section primitives for builder-inserted website blocks and normal published pages. All classes are prefixed with `ss-` and are intended to compose with existing layout, spacing, button, card, form, and builder state classes.

## Section System

Use `.ss-section` as the base wrapper, then compose spacing, background, alignment, and width modifiers:

- `.ss-section-sm`, `.ss-section-lg`, `.ss-section-xl`
- `.ss-section-surface`, `.ss-section-soft`, `.ss-section-primary-soft`, `.ss-section-accent-soft`, `.ss-section-dark`
- `.ss-section-bordered`, `.ss-section-center`, `.ss-section-narrow`, `.ss-section-wide`, `.ss-section-split`

Common content classes are `.ss-section-header`, `.ss-section-eyebrow`, `.ss-section-title`, `.ss-section-subtitle`, `.ss-section-body`, `.ss-section-actions`, `.ss-section-media`, and `.ss-section-kicker`.

## Website Sections

Section intent classes make generated markup easy to read:

- `.ss-section-hero`
- `.ss-section-feature`
- `.ss-section-services`
- `.ss-section-about`
- `.ss-section-cta`
- `.ss-section-pricing`
- `.ss-section-testimonials`
- `.ss-section-faq`
- `.ss-section-gallery`
- `.ss-section-contact`
- `.ss-section-footer`

These classes do not lock a section to one industry. The same service card can represent repairs, consulting, restaurants, salons, trades, shops, or online services.

## Pattern Classes

Use grid and card classes for repeatable blocks:

- Features: `.ss-feature-grid`, `.ss-feature-grid-2`, `.ss-feature-grid-4`, `.ss-feature-card`, `.ss-feature-icon`, `.ss-feature-title`, `.ss-feature-desc`, `.ss-feature-link`, `.ss-feature-list`
- Services: `.ss-service-grid`, `.ss-service-card`, `.ss-service-card-featured`, `.ss-service-image`, `.ss-service-icon`, `.ss-service-title`, `.ss-service-desc`, `.ss-service-meta`, `.ss-service-action`, `.ss-service-list`
- About: `.ss-stats-row`, `.ss-stat`, `.ss-stat-value`, `.ss-stat-label`, `.ss-value-list`, `.ss-value-item`, `.ss-owner-card`, `.ss-story-block`, `.ss-mission-block`
- CTA: `.ss-cta-card`, `.ss-cta-banner`, `.ss-cta-contact-row`, `.ss-cta-urgency`, `.ss-phone-strip`
- Pricing: `.ss-pricing-grid`, `.ss-pricing-card`, `.ss-pricing-card-featured`, `.ss-price-value`, `.ss-price-billing`, `.ss-pricing-features`, `.ss-pricing-fineprint`
- Reviews: `.ss-review-grid`, `.ss-testimonial-card`, `.ss-testimonial-featured`, `.ss-review-quote`, `.ss-review-stars`, `.ss-reviewer-name`, `.ss-reviewer-meta`
- FAQ: `.ss-faq-list`, `.ss-faq-item`, `.ss-faq-question`, `.ss-faq-answer`, `.ss-faq-compact`
- Gallery: `.ss-gallery-grid`, `.ss-gallery-masonry`, `.ss-gallery-card`, `.ss-gallery-caption`, `.ss-gallery-placeholder`, `.ss-before-after`
- Contact: `.ss-contact-grid`, `.ss-contact-form-card`, `.ss-contact-details-card`, `.ss-contact-method`, `.ss-address-block`, `.ss-contact-note`, `.ss-map-wrapper`
- Footer: `.ss-footer`, `.ss-footer-grid`, `.ss-footer-brand`, `.ss-footer-links`, `.ss-footer-group-title`, `.ss-social-links`, `.ss-footer-bottom`

## Local Business Blocks

Reusable local-business helpers include `.ss-business-card`, `.ss-business-hours-card`, `.ss-business-hours-row`, `.ss-status-open`, `.ss-status-closed`, `.ss-location-card`, `.ss-map-card`, `.ss-review-summary-card`, `.ss-announcement-bar`, `.ss-emergency-banner`, `.ss-coupon-card`, `.ss-offer-code`, `.ss-phone-strip`, `.ss-service-area-list`, `.ss-team-card`, and `.ss-credentials-card`.

## Builder Compatibility

Sections can be used inside Phase 05 builder markup:

```html
<section class="ss-builder-section ss-section ss-section-hero ss-section-soft">
  <div class="ss-section-wide ss-section-split">
    <div class="ss-builder-block">
      <p class="ss-section-eyebrow">Locally owned</p>
      <h1 class="ss-section-title">Reliable service for busy property owners</h1>
    </div>
  </div>
</section>
```

Builder states such as `.ss-is-selected`, `.ss-is-hovered`, and `.ss-is-drop-inside` still work because the section layer avoids high z-index and aggressive overflow rules.

## Content Safety

The section patterns use `min-width: 0`, `overflow-wrap`, responsive media sizing, stacked mobile actions, responsive map/embed wrappers, and resilient card layouts. They are safe defaults for generated local-business sites where content length and media quality vary.
