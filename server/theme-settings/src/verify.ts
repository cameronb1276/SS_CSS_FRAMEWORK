import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { AddressInfo } from "node:net";
import { createApp } from "./app";

async function request(baseUrl: string, method: string, route: string, body?: unknown) {
  const response = await fetch(`${baseUrl}${route}`, {
    method,
    headers: body === undefined ? undefined : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const json = await response.json() as unknown;
  return { response, json };
}

async function main() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "ss-theme-settings-"));
  process.env.THEME_SETTINGS_DATA_DIR = tempRoot;
  process.env.REQUEST_LOGGING = "false";

  const app = createApp();
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
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

    result = await request(baseUrl, "POST", "/api/sites/demo-site/rebuild-theme");
    if (!result.response.ok) throw new Error("Theme rebuild failed.");

    result = await request(baseUrl, "PUT", "/api/sites/demo-site/custom-js", {
      enabled: true,
      content: "window.siteThemeLoaded = true;"
    });
    if (!result.response.ok) throw new Error("Custom JS storage failed.");

    const themeCss = await fs.readFile(path.join(tempRoot, "sites", "demo-site", "theme.css"), "utf8");
    if (!themeCss.includes('[data-ss-site-theme="demo-site"]')) {
      throw new Error("Generated CSS is not scoped to the site.");
    }

    console.log("Phase 11 verification passed.");
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
