import { badRequest } from "../utils/errors";
import {
  ButtonSettings,
  BuilderSettings,
  CustomCodeSettings,
  LayoutSettings,
  PublishedSettings,
  SectionSettings,
  SettingsUpdate,
  SiteSettings,
  ThemeColors,
  ThemeSettings,
  ThemeSettingsDocument,
  TimestampSettings,
  TypographySettings
} from "../types/settings";
import { validateSiteId } from "./siteId";

export const CUSTOM_CSS_LIMIT = 100_000;
export const CUSTOM_JS_LIMIT = 50_000;

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const RGBA_COLOR = /^rgba\(\s*(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\s*,\s*(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\s*,\s*(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\s*,\s*(?:0|1|0?\.\d+)\s*\)$/;

const themeNames = ["default", "blueprint", "emerald", "violet", "slate", "amber"] as const;
const fontPresets = ["system", "serif", "mono", "rounded"] as const;
const sizePresets = ["compact", "comfortable", "spacious"] as const;
const widthPresets = ["narrow", "standard", "wide", "full"] as const;
const radiusPresets = ["sharp", "soft", "rounded", "pill-heavy"] as const;
const shadowPresets = ["flat", "soft", "elevated", "strong"] as const;
const buttonStyles = ["filled", "soft", "outline", "rounded", "minimal"] as const;
const textTransforms = ["none", "uppercase"] as const;
const ctaBackgrounds = ["plain", "soft", "tinted", "dark"] as const;
const footerBackgrounds = ["dark", "surface", "soft"] as const;
const cardStyles = ["flat", "bordered", "elevated"] as const;
const devices = ["desktop", "laptop", "tablet", "mobile", "mobile-narrow", "full"] as const;
const panels = ["library", "layers", "inspector", "assets", "theme"] as const;

type MutableObject = Record<string, unknown>;

export function assertPlainObject(value: unknown, label: string): MutableObject {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw badRequest(`${label} must be an object.`);
  }
  return value as MutableObject;
}

function stringValue(value: unknown, label: string, max = 120): string {
  if (typeof value !== "string" || value.trim().length === 0 || value.length > max) {
    throw badRequest(`${label} must be a non-empty string up to ${max} characters.`);
  }
  return value.trim();
}

function nullableIso(value: unknown, label: string): string | null {
  if (value === null) return null;
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    throw badRequest(`${label} must be null or an ISO date string.`);
  }
  return value;
}

function booleanValue(value: unknown, label: string): boolean {
  if (typeof value !== "boolean") {
    throw badRequest(`${label} must be boolean.`);
  }
  return value;
}

function numberRange(value: unknown, label: string, min: number, max: number): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) {
    throw badRequest(`${label} must be a number between ${min} and ${max}.`);
  }
  return value;
}

function enumValue<T extends readonly string[]>(value: unknown, label: string, allowed: T): T[number] {
  if (typeof value !== "string" || !allowed.includes(value)) {
    throw badRequest(`${label} must be one of: ${allowed.join(", ")}.`);
  }
  return value as T[number];
}

export function validateColor(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length > 48) {
    throw badRequest(`${label} must be a short color string.`);
  }
  if (value.includes("url") || value.includes(";") || value.includes("{") || value.includes("}") || value.includes("<")) {
    throw badRequest(`${label} contains unsafe CSS characters.`);
  }
  if (!HEX_COLOR.test(value) && !RGBA_COLOR.test(value)) {
    throw badRequest(`${label} must be a hex color or safe rgba() value.`);
  }
  return value;
}

function rejectUnknown(obj: MutableObject, allowed: string[], label: string): void {
  const unknown = Object.keys(obj).filter((key) => !allowed.includes(key));
  if (unknown.length > 0) {
    throw badRequest(`${label} contains unsupported fields.`, unknown);
  }
}

function validateThemeColors(value: unknown, label: string, partial = false): ThemeColors | Partial<ThemeColors> {
  const obj = assertPlainObject(value, label);
  const fields = ["primary", "primaryHover", "secondary", "accent", "background", "surface", "surfaceSoft", "headingText", "bodyText", "mutedText", "border", "focus", "success", "warning", "danger", "info"];
  rejectUnknown(obj, fields, label);
  const result: Partial<ThemeColors> = {};
  for (const key of fields) {
    if (obj[key] !== undefined) {
      result[key as keyof ThemeColors] = validateColor(obj[key], `${label}.${key}`);
    } else if (!partial && !["success", "warning", "danger", "info"].includes(key)) {
      throw badRequest(`${label}.${key} is required.`);
    }
  }
  return result;
}

function validateSite(value: unknown): SiteSettings {
  const obj = assertPlainObject(value, "site");
  rejectUnknown(obj, ["id", "name", "themeName", "published"], "site");
  return {
    id: validateSiteId(obj.id),
    name: stringValue(obj.name, "site.name"),
    themeName: stringValue(obj.themeName, "site.themeName", 80),
    published: booleanValue(obj.published, "site.published")
  };
}

function validateTheme(value: unknown): ThemeSettings {
  const obj = assertPlainObject(value, "theme");
  rejectUnknown(obj, ["name", "light", "dark"], "theme");
  return {
    name: enumValue(obj.name, "theme.name", themeNames),
    light: validateThemeColors(obj.light, "theme.light") as ThemeColors,
    dark: obj.dark === undefined ? {} : validateThemeColors(obj.dark, "theme.dark", true)
  };
}

function validateLayout(value: unknown): LayoutSettings {
  const obj = assertPlainObject(value, "layout");
  rejectUnknown(obj, ["pageGutter", "containerWidth", "sectionSpacing", "contentDensity", "gridGap", "borderRadius", "shadow"], "layout");
  return {
    pageGutter: enumValue(obj.pageGutter, "layout.pageGutter", sizePresets),
    containerWidth: enumValue(obj.containerWidth, "layout.containerWidth", widthPresets),
    sectionSpacing: enumValue(obj.sectionSpacing, "layout.sectionSpacing", sizePresets),
    contentDensity: enumValue(obj.contentDensity, "layout.contentDensity", sizePresets),
    gridGap: enumValue(obj.gridGap, "layout.gridGap", sizePresets),
    borderRadius: enumValue(obj.borderRadius, "layout.borderRadius", radiusPresets),
    shadow: enumValue(obj.shadow, "layout.shadow", shadowPresets)
  };
}

function validateTypography(value: unknown): TypographySettings {
  const obj = assertPlainObject(value, "typography");
  rejectUnknown(obj, ["fontPreset", "headingFontPreset", "baseSize", "headingScale", "lineHeight", "letterSpacing"], "typography");
  return {
    fontPreset: enumValue(obj.fontPreset, "typography.fontPreset", fontPresets),
    headingFontPreset: enumValue(obj.headingFontPreset, "typography.headingFontPreset", fontPresets),
    baseSize: enumValue(obj.baseSize, "typography.baseSize", ["sm", "base", "lg"] as const),
    headingScale: enumValue(obj.headingScale, "typography.headingScale", sizePresets),
    lineHeight: enumValue(obj.lineHeight, "typography.lineHeight", ["tight", "normal", "loose"] as const),
    letterSpacing: enumValue(obj.letterSpacing, "typography.letterSpacing", ["normal", "wide"] as const)
  };
}

function validateButtons(value: unknown): ButtonSettings {
  const obj = assertPlainObject(value, "buttons");
  rejectUnknown(obj, ["radiusStyle", "primaryStyle", "secondaryStyle", "shadow", "size", "textTransform"], "buttons");
  return {
    radiusStyle: enumValue(obj.radiusStyle, "buttons.radiusStyle", radiusPresets),
    primaryStyle: enumValue(obj.primaryStyle, "buttons.primaryStyle", buttonStyles),
    secondaryStyle: enumValue(obj.secondaryStyle, "buttons.secondaryStyle", buttonStyles),
    shadow: booleanValue(obj.shadow, "buttons.shadow"),
    size: enumValue(obj.size, "buttons.size", sizePresets),
    textTransform: enumValue(obj.textTransform, "buttons.textTransform", textTransforms)
  };
}

function validateSections(value: unknown): SectionSettings {
  const obj = assertPlainObject(value, "sections");
  rejectUnknown(obj, ["heroSpacing", "servicesSpacing", "ctaBackground", "footerBackground", "cardStyle", "imageRadius", "dividers"], "sections");
  return {
    heroSpacing: enumValue(obj.heroSpacing, "sections.heroSpacing", sizePresets),
    servicesSpacing: enumValue(obj.servicesSpacing, "sections.servicesSpacing", sizePresets),
    ctaBackground: enumValue(obj.ctaBackground, "sections.ctaBackground", ctaBackgrounds),
    footerBackground: enumValue(obj.footerBackground, "sections.footerBackground", footerBackgrounds),
    cardStyle: enumValue(obj.cardStyle, "sections.cardStyle", cardStyles),
    imageRadius: enumValue(obj.imageRadius, "sections.imageRadius", radiusPresets),
    dividers: booleanValue(obj.dividers, "sections.dividers")
  };
}

function validateBuilder(value: unknown): BuilderSettings {
  const obj = assertPlainObject(value, "builder");
  rejectUnknown(obj, ["lastPreviewDevice", "canvasZoom", "showGrid", "snapToGrid", "lastOpenedPanel"], "builder");
  return {
    lastPreviewDevice: enumValue(obj.lastPreviewDevice, "builder.lastPreviewDevice", devices),
    canvasZoom: numberRange(obj.canvasZoom, "builder.canvasZoom", 0.25, 2),
    showGrid: booleanValue(obj.showGrid, "builder.showGrid"),
    snapToGrid: booleanValue(obj.snapToGrid, "builder.snapToGrid"),
    lastOpenedPanel: enumValue(obj.lastOpenedPanel, "builder.lastOpenedPanel", panels)
  };
}

function validatePublished(value: unknown): PublishedSettings {
  const obj = assertPlainObject(value, "published");
  rejectUnknown(obj, ["published", "lastPublishedAt", "themeFilePath", "cssCacheVersion", "customCssEnabled", "customJsEnabled", "minifyCss"], "published");
  return {
    published: booleanValue(obj.published, "published.published"),
    lastPublishedAt: nullableIso(obj.lastPublishedAt, "published.lastPublishedAt"),
    themeFilePath: stringValue(obj.themeFilePath, "published.themeFilePath", 160),
    cssCacheVersion: stringValue(obj.cssCacheVersion, "published.cssCacheVersion", 60),
    customCssEnabled: booleanValue(obj.customCssEnabled, "published.customCssEnabled"),
    customJsEnabled: booleanValue(obj.customJsEnabled, "published.customJsEnabled"),
    minifyCss: booleanValue(obj.minifyCss, "published.minifyCss")
  };
}

function validateCustomCode(value: unknown): CustomCodeSettings {
  const obj = assertPlainObject(value, "customCode");
  rejectUnknown(obj, ["customCssUpdatedAt", "customJsUpdatedAt", "customCssSize", "customJsSize"], "customCode");
  return {
    customCssUpdatedAt: nullableIso(obj.customCssUpdatedAt, "customCode.customCssUpdatedAt"),
    customJsUpdatedAt: nullableIso(obj.customJsUpdatedAt, "customCode.customJsUpdatedAt"),
    customCssSize: numberRange(obj.customCssSize, "customCode.customCssSize", 0, CUSTOM_CSS_LIMIT),
    customJsSize: numberRange(obj.customJsSize, "customCode.customJsSize", 0, CUSTOM_JS_LIMIT)
  };
}

function validateTimestamps(value: unknown): TimestampSettings {
  const obj = assertPlainObject(value, "timestamps");
  rejectUnknown(obj, ["createdAt", "updatedAt"], "timestamps");
  return {
    createdAt: nullableIso(obj.createdAt, "timestamps.createdAt") ?? "",
    updatedAt: nullableIso(obj.updatedAt, "timestamps.updatedAt") ?? ""
  };
}

export function validateSettingsDocument(value: unknown): ThemeSettingsDocument {
  const obj = assertPlainObject(value, "settings");
  rejectUnknown(obj, ["schemaVersion", "site", "theme", "layout", "typography", "buttons", "sections", "builder", "published", "customCode", "timestamps"], "settings");
  if (obj.schemaVersion !== 1) {
    throw badRequest("settings.schemaVersion must be 1.");
  }
  return {
    schemaVersion: 1,
    site: validateSite(obj.site),
    theme: validateTheme(obj.theme),
    layout: validateLayout(obj.layout),
    typography: validateTypography(obj.typography),
    buttons: validateButtons(obj.buttons),
    sections: validateSections(obj.sections),
    builder: validateBuilder(obj.builder),
    published: validatePublished(obj.published),
    customCode: validateCustomCode(obj.customCode),
    timestamps: validateTimestamps(obj.timestamps)
  };
}

export function validateSettingsUpdate(value: unknown): SettingsUpdate {
  const update = assertPlainObject(value, "settings update");
  rejectUnknown(update, ["site", "theme", "layout", "typography", "buttons", "sections", "builder", "published", "customCode"], "settings update");
  return update as SettingsUpdate;
}

export function validateCustomCssPayload(value: unknown): { enabled: boolean; content: string } {
  const obj = assertPlainObject(value, "custom CSS payload");
  rejectUnknown(obj, ["enabled", "content"], "custom CSS payload");
  if (typeof obj.content !== "string" || obj.content.length > CUSTOM_CSS_LIMIT) {
    throw badRequest(`custom CSS content must be a string up to ${CUSTOM_CSS_LIMIT} bytes.`);
  }
  return { enabled: booleanValue(obj.enabled, "custom CSS enabled"), content: obj.content };
}

export function validateCustomJsPayload(value: unknown): { enabled: boolean; content: string } {
  const obj = assertPlainObject(value, "custom JS payload");
  rejectUnknown(obj, ["enabled", "content"], "custom JS payload");
  if (typeof obj.content !== "string" || obj.content.length > CUSTOM_JS_LIMIT) {
    throw badRequest(`custom JS content must be a string up to ${CUSTOM_JS_LIMIT} bytes.`);
  }
  return { enabled: booleanValue(obj.enabled, "custom JS enabled"), content: obj.content };
}
