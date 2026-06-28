import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { AddressInfo } from "node:net";
import { createApp } from "./app";
import { allowedOrigins } from "./config";
import { resetWriteRateLimitBuckets } from "./middleware/rateLimit";

async function request(baseUrl: string, method: string, route: string, body?: unknown, headers?: Record<string, string>) {
  const response = await fetch(`${baseUrl}${route}`, {
    method,
    headers: body === undefined ? headers : { "content-type": "application/json", ...(headers ?? {}) },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const json = await response.json() as unknown;
  return { response, json };
}

async function withServer<T>(run: (baseUrl: string, tempRoot: string) => Promise<T>): Promise<T> {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "ss-theme-settings-"));
  process.env.THEME_SETTINGS_DATA_DIR = tempRoot;
  const app = createApp();
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    return await run(baseUrl, tempRoot);
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
}

async function main() {
  process.env.REQUEST_LOGGING = "false";
  process.env.LOCAL_DEVELOPMENT_MODE = "true";
  process.env.CUSTOM_JS_EDITING_ENABLED = "false";
  process.env.WRITE_RATE_LIMIT_MAX = "60";
  delete process.env.NODE_ENV;
  delete process.env.THEME_BACKEND_PRODUCTION_MODE;
  delete process.env.ADMIN_API_TOKEN;

  await withServer(async (baseUrl, tempRoot) => {
    let result = await request(baseUrl, "GET", "/api/health");
    if (!result.response.ok) throw new Error("Health check failed.");

    result = await request(baseUrl, "POST", "/api/sites", {
      siteId: "demo-site",
      siteName: "Demo Site",
      themeName: "Demo Theme"
    });
    if (result.response.status !== 201) throw new Error("Site creation failed.");

    result = await request(baseUrl, "GET", "/api/sites/demo-site/settings");
    if (!result.response.ok) throw new Error("Settings read failed.");

    result = await request(baseUrl, "PUT", "/api/sites/demo-site/settings", {
      theme: { light: { primary: "#0ea5e9", focus: "#0ea5e9" } }
    });
    if (!result.response.ok) throw new Error("Valid settings update failed.");

    result = await request(baseUrl, "PUT", "/api/sites/demo-site/settings", {
      theme: { light: { primary: "url(javascript:alert(1))" } }
    });
    if (result.response.status !== 400) throw new Error("Invalid color was not rejected.");

    result = await request(baseUrl, "GET", "/api/sites/..%2Fbad/settings");
    if (result.response.status !== 400) throw new Error("Traversal site ID was not rejected.");

    for (const unsafeId of ["bad/site", "bad\\site", " bad", "bad..site", "a".repeat(65), "%2e%2e-bad"]) {
      result = await request(baseUrl, "GET", `/api/sites/${encodeURIComponent(unsafeId)}/settings`);
      if (result.response.status !== 400) throw new Error(`Unsafe site ID was not rejected: ${unsafeId}`);
    }

    result = await request(baseUrl, "PUT", "/api/sites/demo-site/settings", {
      layout: { borderRadius: "roundish" }
    });
    if (result.response.status !== 400) throw new Error("Unknown preset was not rejected.");

    process.env.MAX_CUSTOM_CSS_BYTES = "8";
    result = await request(baseUrl, "PUT", "/api/sites/demo-site/custom-css", {
      enabled: true,
      content: "123456789"
    });
    if (result.response.status !== 400) throw new Error("Oversized custom CSS was not rejected.");
    process.env.MAX_CUSTOM_CSS_BYTES = "100000";

    result = await request(baseUrl, "POST", "/api/sites/demo-site/rebuild-theme", {});
    if (!result.response.ok) throw new Error("Theme rebuild failed.");

    result = await request(baseUrl, "PUT", "/api/sites/demo-site/custom-js", {
      enabled: true,
      content: "window.siteThemeLoaded = true;"
    });
    if (result.response.status !== 400) throw new Error("Custom JS editing should be disabled by default.");

    result = await request(baseUrl, "PUT", "/api/sites/demo-site/custom-js", {
      enabled: false,
      content: ""
    });
    if (!result.response.ok) throw new Error("Disabled custom JS clear/save failed.");

    const themeCss = await fs.readFile(path.join(tempRoot, "sites", "demo-site", "theme.css"), "utf8");
    if (!themeCss.includes('[data-ss-site-theme="demo-site"]')) {
      throw new Error("Generated CSS is not scoped to the site.");
    }

    const auditLog = await fs.readFile(path.join(tempRoot, "audit", "audit.log"), "utf8");
    if (!auditLog.includes("settings.updated") || !auditLog.includes("theme.rebuilt") || !auditLog.includes("validation.failure")) {
      throw new Error("Expected audit events were not written.");
    }
  });

  process.env.LOCAL_DEVELOPMENT_MODE = "false";
  process.env.THEME_BACKEND_PRODUCTION_MODE = "true";
  delete process.env.ADMIN_API_TOKEN;
  if (allowedOrigins().includes("*")) throw new Error("Production origins must not wildcard by default.");
  await withServer(async (baseUrl) => {
    const result = await request(baseUrl, "POST", "/api/sites", {
      siteId: "prod-denied",
      siteName: "Prod Denied"
    });
    if (result.response.status !== 401) throw new Error("Production mode without auth did not fail closed.");
  });

  process.env.LOCAL_DEVELOPMENT_MODE = "true";
  process.env.THEME_BACKEND_PRODUCTION_MODE = "false";
  process.env.WRITE_RATE_LIMIT_MAX = "1";
  process.env.WRITE_RATE_LIMIT_WINDOW_MS = "60000";
  resetWriteRateLimitBuckets();
  await withServer(async (baseUrl) => {
    let result = await request(baseUrl, "POST", "/api/sites", {
      siteId: "limited-one",
      siteName: "Limited One"
    });
    if (result.response.status !== 201) throw new Error("Rate limit setup first write failed.");
    result = await request(baseUrl, "POST", "/api/sites", {
      siteId: "limited-two",
      siteName: "Limited Two"
    });
    if (result.response.status !== 429) throw new Error("Write rate limit did not reject the second write.");
  });

  console.log("Phase 13 verification passed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
