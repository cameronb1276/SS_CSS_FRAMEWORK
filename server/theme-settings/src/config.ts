const LOCAL_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3004",
  "http://localhost:8080",
  "http://localhost:8095",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3004",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:8095",
  "null"
];

function boolEnv(name: string, defaultValue: boolean): boolean {
  const value = process.env[name];
  if (value === undefined) return defaultValue;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function intEnv(name: string, defaultValue: number, min: number, max: number): number {
  const value = process.env[name];
  if (value === undefined) return defaultValue;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) return defaultValue;
  return parsed;
}

function listEnv(name: string, defaultValue: string[]): string[] {
  const value = process.env[name];
  if (value === undefined) return defaultValue;
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export function isProductionMode(): boolean {
  return process.env.NODE_ENV === "production" || boolEnv("THEME_BACKEND_PRODUCTION_MODE", false);
}

export function isLocalDevelopmentMode(): boolean {
  if (process.env.LOCAL_DEVELOPMENT_MODE !== undefined) {
    return boolEnv("LOCAL_DEVELOPMENT_MODE", true);
  }
  return !isProductionMode();
}

export function serverPort(): number {
  return intEnv("PORT", 3004, 1, 65535);
}

export function jsonBodyLimit(): string {
  return process.env.MAX_JSON_BODY_SIZE ?? "256kb";
}

export function allowedOrigins(): string[] {
  return listEnv("ALLOWED_ORIGINS", isProductionMode() ? [] : LOCAL_ORIGINS);
}

export function adminApiToken(): string | undefined {
  const value = process.env.ADMIN_API_TOKEN?.trim();
  return value ? value : undefined;
}

export function customCssLimit(): number {
  return intEnv("MAX_CUSTOM_CSS_BYTES", 100_000, 0, 1_000_000);
}

export function customJsLimit(): number {
  return intEnv("MAX_CUSTOM_JS_BYTES", 50_000, 0, 500_000);
}

export function customJsEditingEnabled(): boolean {
  return boolEnv("CUSTOM_JS_EDITING_ENABLED", false);
}

export function publicThemeReadEnabled(): boolean {
  return boolEnv("PUBLIC_THEME_READ_ENABLED", true);
}

export function customHtmlBlocksEnabled(): boolean {
  return boolEnv("CUSTOM_HTML_BLOCKS_ENABLED", false);
}

export function customJsPublishingEnabled(): boolean {
  return boolEnv("CUSTOM_JS_PUBLISHING_ENABLED", false);
}

export function writeRateLimitMax(): number {
  return intEnv("WRITE_RATE_LIMIT_MAX", 60, 1, 10_000);
}

export function writeRateLimitWindowMs(): number {
  return intEnv("WRITE_RATE_LIMIT_WINDOW_MS", 60_000, 1_000, 3_600_000);
}
