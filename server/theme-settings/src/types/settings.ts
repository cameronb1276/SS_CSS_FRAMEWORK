export type DevicePreview = "desktop" | "laptop" | "tablet" | "mobile" | "mobile-narrow" | "full";
export type PresetTheme = "default" | "blueprint" | "emerald" | "violet" | "slate" | "amber";
export type FontPreset = "system" | "serif" | "mono" | "rounded";
export type SizePreset = "compact" | "comfortable" | "spacious";
export type WidthPreset = "narrow" | "standard" | "wide" | "full";
export type RadiusPreset = "sharp" | "soft" | "rounded" | "pill-heavy";
export type ShadowPreset = "flat" | "soft" | "elevated" | "strong";
export type ButtonStyle = "filled" | "soft" | "outline" | "rounded" | "minimal";
export type TextTransform = "none" | "uppercase";
export type FooterBackground = "dark" | "surface" | "soft";
export type CtaBackground = "plain" | "soft" | "tinted" | "dark";
export type CardStyle = "flat" | "bordered" | "elevated";

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceSoft: string;
  headingText: string;
  bodyText: string;
  mutedText: string;
  border: string;
  focus: string;
  success?: string;
  warning?: string;
  danger?: string;
  info?: string;
}

export interface ThemeSettings {
  name: PresetTheme;
  light: ThemeColors;
  dark?: Partial<ThemeColors>;
}

export interface SiteSettings {
  id: string;
  name: string;
  themeName: string;
  published: boolean;
}

export interface LayoutSettings {
  pageGutter: SizePreset;
  containerWidth: WidthPreset;
  sectionSpacing: SizePreset;
  contentDensity: SizePreset;
  gridGap: SizePreset;
  borderRadius: RadiusPreset;
  shadow: ShadowPreset;
}

export interface TypographySettings {
  fontPreset: FontPreset;
  headingFontPreset: FontPreset;
  baseSize: "sm" | "base" | "lg";
  headingScale: SizePreset;
  lineHeight: "tight" | "normal" | "loose";
  letterSpacing: "normal" | "wide";
}

export interface ButtonSettings {
  radiusStyle: RadiusPreset;
  primaryStyle: ButtonStyle;
  secondaryStyle: ButtonStyle;
  shadow: boolean;
  size: SizePreset;
  textTransform: TextTransform;
}

export interface SectionSettings {
  heroSpacing: SizePreset;
  servicesSpacing: SizePreset;
  ctaBackground: CtaBackground;
  footerBackground: FooterBackground;
  cardStyle: CardStyle;
  imageRadius: RadiusPreset;
  dividers: boolean;
}

export interface BuilderSettings {
  lastPreviewDevice: DevicePreview;
  canvasZoom: number;
  showGrid: boolean;
  snapToGrid: boolean;
  lastOpenedPanel: "library" | "layers" | "inspector" | "assets" | "theme";
}

export interface PublishedSettings {
  published: boolean;
  lastPublishedAt: string | null;
  themeFilePath: string;
  cssCacheVersion: string;
  customCssEnabled: boolean;
  customJsEnabled: boolean;
  minifyCss: boolean;
}

export interface CustomCodeSettings {
  customCssUpdatedAt: string | null;
  customJsUpdatedAt: string | null;
  customCssSize: number;
  customJsSize: number;
}

export interface TimestampSettings {
  createdAt: string;
  updatedAt: string;
}

export interface ThemeSettingsDocument {
  schemaVersion: 1;
  site: SiteSettings;
  theme: ThemeSettings;
  layout: LayoutSettings;
  typography: TypographySettings;
  buttons: ButtonSettings;
  sections: SectionSettings;
  builder: BuilderSettings;
  published: PublishedSettings;
  customCode: CustomCodeSettings;
  timestamps: TimestampSettings;
}

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type SettingsUpdate = DeepPartial<Omit<ThemeSettingsDocument, "schemaVersion" | "timestamps">>;
