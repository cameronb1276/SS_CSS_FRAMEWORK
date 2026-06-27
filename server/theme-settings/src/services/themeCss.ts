import { ThemeSettingsDocument } from "../types/settings";

const gutterMap = {
  compact: "clamp(0.75rem, 2vw, 1.25rem)",
  comfortable: "clamp(1rem, 3vw, 2rem)",
  spacious: "clamp(1.5rem, 4vw, 3rem)"
};

const spacingMap = {
  compact: "var(--ss-space-10)",
  comfortable: "var(--ss-space-16)",
  spacious: "var(--ss-space-20)"
};

const gapMap = {
  compact: "var(--ss-space-4)",
  comfortable: "var(--ss-space-6)",
  spacious: "var(--ss-space-8)"
};

const radiusMap = {
  sharp: "var(--ss-radius-sm)",
  soft: "var(--ss-radius-lg)",
  rounded: "var(--ss-radius-xl)",
  "pill-heavy": "var(--ss-radius-pill)"
};

const shadowMap = {
  flat: "none",
  soft: "var(--ss-shadow-sm)",
  elevated: "var(--ss-shadow-md)",
  strong: "var(--ss-shadow-lg)"
};

const widthMap = {
  narrow: "var(--ss-width-md)",
  standard: "var(--ss-width-lg)",
  wide: "var(--ss-width-xl)",
  full: "100%"
};

const fontMap = {
  system: "var(--ss-font-sans)",
  serif: 'Georgia, "Times New Roman", serif',
  mono: "var(--ss-font-mono)",
  rounded: 'ui-rounded, "SF Pro Rounded", system-ui, sans-serif'
};

const baseSizeMap = {
  sm: "0.9375rem",
  base: "1rem",
  lg: "1.0625rem"
};

const lineHeightMap = {
  tight: "1.35",
  normal: "var(--ss-line-height-base)",
  loose: "var(--ss-line-height-loose)"
};

const buttonPaddingMap = {
  compact: "var(--ss-space-2) var(--ss-space-3)",
  comfortable: "var(--ss-space-2) var(--ss-space-4)",
  spacious: "var(--ss-space-3) var(--ss-space-5)"
};

function selectorFor(siteId: string): string {
  return `[data-ss-site-theme="${siteId}"], .ss-site-theme-${siteId}`;
}

export function generateThemeCss(settings: ThemeSettingsDocument): string {
  const siteId = settings.site.id;
  const c = settings.theme.light;
  const selector = selectorFor(siteId);
  const generatedAt = new Date().toISOString();
  const buttonShadow = settings.buttons.shadow ? "var(--ss-shadow-sm)" : "none";
  const textTransform = settings.buttons.textTransform === "uppercase" ? "uppercase" : "none";
  const sectionDivider = settings.sections.dividers ? "var(--ss-border-width) solid var(--ss-border)" : "0";

  return `/*!
 * SS CSS generated site theme
 * Site: ${siteId}
 * Generated: ${generatedAt}
 */

${selector} {
  --ss-brand-primary: ${c.primary};
  --ss-brand-primary-hover: ${c.primaryHover};
  --ss-brand-secondary: ${c.secondary};
  --ss-brand-accent: ${c.accent};
  --ss-brand-bg: ${c.background};
  --ss-brand-surface: ${c.surface};
  --ss-brand-surface-soft: ${c.surfaceSoft};
  --ss-brand-border: ${c.border};
  --ss-brand-heading: ${c.headingText};
  --ss-brand-body: ${c.bodyText};
  --ss-brand-muted: ${c.mutedText};
  --ss-brand-link: ${c.primary};
  --ss-brand-focus: ${c.focus};
  --ss-color-primary: ${c.primary};
  --ss-color-primary-hover: ${c.primaryHover};
  --ss-color-secondary: ${c.secondary};
  --ss-color-accent: ${c.accent};
  --ss-bg: ${c.background};
  --ss-surface: ${c.surface};
  --ss-surface-soft: ${c.surfaceSoft};
  --ss-border: ${c.border};
  --ss-text: ${c.bodyText};
  --ss-text-muted: ${c.mutedText};
  --ss-link: ${c.primary};
  --ss-link-hover: ${c.primaryHover};
  --ss-focus: ${c.focus};
  --ss-page-gutter: ${gutterMap[settings.layout.pageGutter]};
  --ss-client-container-width: ${widthMap[settings.layout.containerWidth]};
  --ss-theme-section-padding-y: ${spacingMap[settings.layout.sectionSpacing]};
  --ss-theme-grid-gap: ${gapMap[settings.layout.gridGap]};
  --ss-theme-card-padding: ${settings.layout.contentDensity === "compact" ? "var(--ss-space-3)" : settings.layout.contentDensity === "spacious" ? "var(--ss-space-6)" : "var(--ss-space-4)"};
  --ss-theme-radius: ${radiusMap[settings.layout.borderRadius]};
  --ss-theme-card-radius: ${radiusMap[settings.layout.borderRadius]};
  --ss-theme-button-radius: ${radiusMap[settings.buttons.radiusStyle]};
  --ss-theme-shadow-card: ${shadowMap[settings.layout.shadow]};
  --ss-theme-body-font: ${fontMap[settings.typography.fontPreset]};
  --ss-theme-heading-font: ${fontMap[settings.typography.headingFontPreset]};
  --ss-theme-body-line-height: ${lineHeightMap[settings.typography.lineHeight]};
  --ss-theme-button-padding: ${buttonPaddingMap[settings.buttons.size]};
  color: var(--ss-text);
  background: var(--ss-bg);
  font-family: var(--ss-theme-body-font);
  font-size: ${baseSizeMap[settings.typography.baseSize]};
  line-height: var(--ss-theme-body-line-height);
}

${selector} .ss-container,
${selector} .ss-container-wide {
  max-width: var(--ss-client-container-width);
}

${selector} .ss-section {
  --ss-section-padding-y: var(--ss-theme-section-padding-y);
  border-top: ${sectionDivider};
}

${selector} .ss-card,
${selector} .ss-feature-card,
${selector} .ss-service-card,
${selector} .ss-pricing-card,
${selector} .ss-testimonial-card {
  border-radius: var(--ss-theme-card-radius);
  box-shadow: var(--ss-theme-shadow-card);
}

${selector} .ss-btn {
  border-radius: var(--ss-theme-button-radius);
  box-shadow: ${buttonShadow};
  padding: var(--ss-theme-button-padding);
  text-transform: ${textTransform};
}

${selector} .ss-section-hero {
  --ss-section-padding-y: ${spacingMap[settings.sections.heroSpacing]};
}

${selector} .ss-section-services {
  --ss-section-padding-y: ${spacingMap[settings.sections.servicesSpacing]};
}

${selector} .ss-section-cta {
  background: ${settings.sections.ctaBackground === "dark" ? "var(--ss-color-dark-bg)" : settings.sections.ctaBackground === "tinted" ? "var(--ss-color-primary-soft)" : settings.sections.ctaBackground === "soft" ? "var(--ss-surface-soft)" : "transparent"};
}

${selector} .ss-footer {
  background: ${settings.sections.footerBackground === "dark" ? "var(--ss-color-dark-bg)" : settings.sections.footerBackground === "soft" ? "var(--ss-surface-soft)" : "var(--ss-surface)"};
}

${selector} .ss-section-media,
${selector} .ss-image-frame,
${selector} .ss-media-frame {
  border-radius: ${radiusMap[settings.sections.imageRadius]};
}
`;
}
