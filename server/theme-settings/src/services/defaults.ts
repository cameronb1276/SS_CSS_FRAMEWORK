import { ThemeSettingsDocument } from "../types/settings";

export function defaultSettings(siteId: string, siteName = "Untitled Site", themeName = "Default Theme"): ThemeSettingsDocument {
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    site: {
      id: siteId,
      name: siteName,
      themeName,
      published: false
    },
    theme: {
      name: "default",
      light: {
        primary: "#3b82f6",
        primaryHover: "#2563eb",
        secondary: "#64748b",
        accent: "#a855f7",
        background: "#f8fafc",
        surface: "#ffffff",
        surfaceSoft: "#f1f5f9",
        headingText: "#0f172a",
        bodyText: "#0f172a",
        mutedText: "#475569",
        border: "#cbd5e1",
        focus: "#3b82f6",
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
        info: "#06b6d4"
      },
      dark: {}
    },
    layout: {
      pageGutter: "comfortable",
      containerWidth: "wide",
      sectionSpacing: "comfortable",
      contentDensity: "comfortable",
      gridGap: "comfortable",
      borderRadius: "soft",
      shadow: "soft"
    },
    typography: {
      fontPreset: "system",
      headingFontPreset: "system",
      baseSize: "base",
      headingScale: "comfortable",
      lineHeight: "normal",
      letterSpacing: "normal"
    },
    buttons: {
      radiusStyle: "soft",
      primaryStyle: "filled",
      secondaryStyle: "outline",
      shadow: false,
      size: "comfortable",
      textTransform: "none"
    },
    sections: {
      heroSpacing: "spacious",
      servicesSpacing: "comfortable",
      ctaBackground: "soft",
      footerBackground: "dark",
      cardStyle: "bordered",
      imageRadius: "soft",
      dividers: false
    },
    builder: {
      lastPreviewDevice: "desktop",
      canvasZoom: 1,
      showGrid: true,
      snapToGrid: true,
      lastOpenedPanel: "theme"
    },
    published: {
      published: false,
      lastPublishedAt: null,
      themeFilePath: "theme.css",
      cssCacheVersion: now,
      customCssEnabled: false,
      customJsEnabled: false,
      minifyCss: false
    },
    customCode: {
      customCssUpdatedAt: null,
      customJsUpdatedAt: null,
      customCssSize: 0,
      customJsSize: 0
    },
    timestamps: {
      createdAt: now,
      updatedAt: now
    }
  };
}
