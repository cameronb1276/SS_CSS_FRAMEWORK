import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { AddressInfo } from "node:net";
import { createApp } from "./app";
import { allowedOrigins } from "./config";
import { resetWriteRateLimitBuckets } from "./middleware/rateLimit";
import { ElementNode } from "./types/elements";
import { PageDocument } from "./types/content";
import { pageToElementTree } from "./services/elementTreeService";
import { validateElementTree } from "./validation/elementTreeValidation";

async function request(baseUrl: string, method: string, route: string, body?: unknown, headers?: Record<string, string>) {
  const response = await fetch(`${baseUrl}${route}`, {
    method,
    headers: body === undefined ? headers : { "content-type": "application/json", ...(headers ?? {}) },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const json = await response.json() as unknown;
  return { response, json };
}

async function textRequest(baseUrl: string, route: string) {
  const response = await fetch(`${baseUrl}${route}`);
  const text = await response.text();
  return { response, text };
}

function getRecord(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} was not an object.`);
  return value as Record<string, unknown>;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function firstChild(root: ElementNode): ElementNode {
  const child = root.children[0];
  if (!child) throw new Error("Expected element tree child.");
  return child;
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

    result = await request(baseUrl, "GET", "/api/sites/demo-site/pages");
    if (!result.response.ok) throw new Error("Page list failed.");
    const pagesPayload = getRecord(result.json, "pages response");
    const pages = pagesPayload.pages as Array<Record<string, unknown>>;
    if (!Array.isArray(pages) || !pages.some((page) => page.pageId === "home")) {
      throw new Error("Default home page was not created.");
    }

    result = await request(baseUrl, "GET", "/api/sites/demo-site/pages/home");
    if (!result.response.ok) throw new Error("Home page read failed.");
    const homePage = getRecord(result.json, "home page response").page;
    const initialTree = pageToElementTree(homePage as PageDocument);
    if (validateElementTree(initialTree, { published: true }).length > 0) {
      throw new Error("Default page element tree did not validate.");
    }
    result = await request(baseUrl, "GET", "/api/element-registry");
    if (!result.response.ok || !Array.isArray(getRecord(result.json, "registry").elements)) throw new Error("Element registry endpoint failed.");
    result = await request(baseUrl, "GET", "/api/sites/demo-site/pages/home/tree");
    if (!result.response.ok) throw new Error("Page tree endpoint failed.");
    const duplicateTree = clone(initialTree);
    firstChild(duplicateTree).elementId = "page-home";
    if (!validateElementTree(duplicateTree).some((item) => item.message.includes("Duplicate element ID"))) {
      throw new Error("Duplicate element IDs were not rejected.");
    }
    const invalidNestingTree = clone(initialTree);
    firstChild(firstChild(invalidNestingTree)).children.push({ ...firstChild(invalidNestingTree), parentId: firstChild(firstChild(invalidNestingTree)).elementId, children: [] });
    if (!validateElementTree(invalidNestingTree).some((item) => item.message.includes("cannot have children") || item.message.includes("cannot contain"))) {
      throw new Error("Invalid nesting was not rejected.");
    }
    const unsafeAttributeTree = clone(initialTree);
    firstChild(unsafeAttributeTree).attributes.onclick = "alert(1)";
    if (!validateElementTree(unsafeAttributeTree).some((item) => item.message.includes("Unsafe attribute"))) {
      throw new Error("Unsafe attributes were not rejected.");
    }
    const badClassTree = clone(initialTree);
    firstChild(badClassTree).classes.custom.push("bad class");
    if (!validateElementTree(badClassTree).some((item) => item.message.includes("Malformed class"))) {
      throw new Error("Malformed class names were not rejected.");
    }
    const missingContentTree = clone(initialTree);
    firstChild(firstChild(missingContentTree)).content.text = "";
    if (!validateElementTree(missingContentTree).some((item) => item.message.includes("requires content field"))) {
      throw new Error("Required content fields were not detected.");
    }
    const builderOnlyTree = clone(initialTree);
    firstChild(builderOnlyTree).children.push({
      elementId: "builder-only-placeholder",
      label: "Builder only",
      type: "custom-code-placeholder",
      parentId: firstChild(builderOnlyTree).elementId,
      children: [],
      content: {},
      design: {},
      classes: { system: [], custom: [] },
      attributes: {},
      visibility: { hidden: false },
      locked: false,
      metadata: { source: "virtual", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    });
    if (!validateElementTree(builderOnlyTree, { published: true }).some((item) => item.message.includes("not safe"))) {
      throw new Error("Published-safety checks did not identify builder-only elements.");
    }
    result = await request(baseUrl, "POST", "/api/sites/demo-site/pages/home/element-operations", {
      operation: "add",
      elementType: "heading",
      parentId: "hero-section",
      position: "inside",
      newElementId: "phase17-heading"
    });
    if (!result.response.ok) throw new Error("Add heading operation failed.");

    result = await request(baseUrl, "POST", "/api/sites/demo-site/pages/home/element-operations", {
      operation: "add",
      elementType: "image",
      parentId: "hero-section",
      position: "inside",
      newElementId: "phase-image-inside-section"
    });
    if (!result.response.ok) throw new Error("Add image inside section operation failed.");

    result = await request(baseUrl, "POST", "/api/sites/demo-site/pages/home/element-operations", {
      operation: "add",
      elementType: "image",
      siblingId: "hero-section",
      position: "after",
      newElementId: "bad-root-image"
    });
    if (result.response.status !== 400 || !JSON.stringify(result.json).includes("inside a section")) {
      throw new Error("Top-level image insertion did not return a helpful rejection.");
    }

    result = await request(baseUrl, "POST", "/api/sites/demo-site/pages/home/element-operations", {
      operation: "add",
      elementType: "section",
      parentId: "phase17-heading",
      position: "inside",
      newElementId: "bad-nested-section"
    });
    if (result.response.status !== 400) throw new Error("Invalid section inside heading was not rejected.");

    result = await request(baseUrl, "POST", "/api/sites/demo-site/pages/home/element-operations", {
      operation: "patch",
      elementId: "phase17-heading",
      patch: { content: { text: "Phase 17 edited heading" } }
    });
    if (!result.response.ok) throw new Error("Patch heading text operation failed.");

    result = await request(baseUrl, "POST", "/api/sites/demo-site/pages/home/element-operations", {
      operation: "rename",
      elementId: "phase17-heading",
      label: "Renamed heading"
    });
    if (!result.response.ok) throw new Error("Rename element operation failed.");

    result = await request(baseUrl, "POST", "/api/sites/demo-site/pages/home/element-operations", {
      operation: "duplicate",
      elementId: "service-card"
    });
    if (!result.response.ok) throw new Error("Duplicate element operation failed.");
    const duplicatedId = String(getRecord(result.json, "duplicate response").selectedElementId);

    result = await request(baseUrl, "POST", "/api/sites/demo-site/pages/home/element-operations", {
      operation: "move",
      elementId: duplicatedId,
      targetParentId: "services-section",
      siblingId: "services-heading",
      position: "before"
    });
    if (!result.response.ok) throw new Error("Move element before sibling failed.");

    result = await request(baseUrl, "POST", "/api/sites/demo-site/pages/home/element-operations", {
      operation: "move",
      elementId: "services-section",
      targetParentId: "service-card",
      position: "inside"
    });
    if (result.response.status !== 400) throw new Error("Moving parent into child or unsupported section move was not rejected.");

    result = await request(baseUrl, "POST", "/api/sites/demo-site/pages/home/element-operations", {
      operation: "set-visibility",
      elementId: "phase17-heading",
      hidden: true
    });
    if (!result.response.ok) throw new Error("Hide element operation failed.");
    result = await request(baseUrl, "POST", "/api/sites/demo-site/pages/home/element-operations", {
      operation: "set-visibility",
      elementId: "phase17-heading",
      hidden: false
    });
    if (!result.response.ok) throw new Error("Show element operation failed.");

    result = await request(baseUrl, "POST", "/api/sites/demo-site/pages/home/element-operations", {
      operation: "set-locked",
      elementId: "phase17-heading",
      locked: true
    });
    if (!result.response.ok) throw new Error("Lock element operation failed.");
    result = await request(baseUrl, "POST", "/api/sites/demo-site/pages/home/element-operations", {
      operation: "patch",
      elementId: "phase17-heading",
      patch: { content: { text: "Should not save" } }
    });
    if (result.response.status !== 400) throw new Error("Locked element edit was not rejected.");
    result = await request(baseUrl, "POST", "/api/sites/demo-site/pages/home/element-operations", {
      operation: "set-locked",
      elementId: "phase17-heading",
      locked: false
    });
    if (!result.response.ok) throw new Error("Unlock element operation failed.");

    result = await request(baseUrl, "POST", "/api/sites/demo-site/pages/home/element-operations", {
      operation: "delete",
      elementId: duplicatedId
    });
    if (!result.response.ok) throw new Error("Delete element operation failed.");

    result = await request(baseUrl, "GET", "/api/sites/demo-site/pages/home/revisions");
    if (!result.response.ok) throw new Error("Revision list failed.");
    const revisions = getRecord(result.json, "revisions response").revisions as Array<Record<string, unknown>>;
    if (!Array.isArray(revisions) || revisions.length === 0) throw new Error("Revision list did not include mutation snapshots.");

    result = await request(baseUrl, "POST", "/api/sites/demo-site/pages/home/undo", {});
    if (!result.response.ok) throw new Error("Undo failed.");
    let historyPage = getRecord(result.json, "undo response").page as PageDocument;
    if (!historyPage.sections.some((section) => section.blocks.some((block) => block.blockId === duplicatedId))) {
      throw new Error("Undo did not restore deleted element.");
    }

    result = await request(baseUrl, "POST", "/api/sites/demo-site/pages/home/redo", {});
    if (!result.response.ok) throw new Error("Redo failed.");
    historyPage = getRecord(result.json, "redo response").page as PageDocument;
    if (historyPage.sections.some((section) => section.blocks.some((block) => block.blockId === duplicatedId))) {
      throw new Error("Redo did not reapply delete.");
    }

    result = await request(baseUrl, "POST", "/api/sites/demo-site/pages/home/revisions/not-a-revision/restore", {});
    if (result.response.status !== 400) throw new Error("Invalid revision ID was not rejected.");

    result = await request(baseUrl, "GET", "/api/sites/demo-site/pages/home/revisions");
    const revisionForRestore = (getRecord(result.json, "revisions after redo").revisions as Array<Record<string, unknown>>)[0]?.revisionId;
    if (typeof revisionForRestore !== "string") throw new Error("No revision was available for restore.");
    result = await request(baseUrl, "POST", `/api/sites/demo-site/pages/home/revisions/${revisionForRestore}/restore`, {});
    if (!result.response.ok) throw new Error("Revision restore failed.");

    result = await request(baseUrl, "POST", "/api/sites/demo-site/publish", {});
    if (!result.response.ok) throw new Error("Publish after element mutations failed.");
    const phase17Html = await fs.readFile(path.join(tempRoot, "published", "demo-site", "index.html"), "utf8");
    if (!phase17Html.includes("Phase 17 edited heading")) throw new Error("Published output did not include edited heading.");
    if (phase17Html.includes(`${duplicatedId} copy`)) throw new Error("Deleted duplicated element leaked into published output.");

    const updatedHome = clone(homePage);
    const updatedHomeRecord = getRecord(updatedHome, "home page");
    updatedHomeRecord.title = "Updated Home";
    result = await request(baseUrl, "PUT", "/api/sites/demo-site/pages/home", updatedHome);
    if (!result.response.ok) throw new Error("Home page update failed.");

    const invalidSlug = clone(updatedHome);
    getRecord(invalidSlug, "invalid slug page").slug = "Bad Slug";
    result = await request(baseUrl, "PUT", "/api/sites/demo-site/pages/home", invalidSlug);
    if (result.response.status !== 400) throw new Error("Invalid page slug was not rejected.");

    const duplicateSection = clone(updatedHome);
    const duplicateSectionRecord = getRecord(duplicateSection, "duplicate section page");
    const duplicateSections = duplicateSectionRecord.sections as Array<Record<string, unknown>>;
    duplicateSections.push(clone(duplicateSections[0]));
    result = await request(baseUrl, "POST", "/api/sites/demo-site/pages/validate", duplicateSection);
    const duplicateSectionValidation = getRecord(result.json, "duplicate section validation");
    if (duplicateSectionValidation.valid !== false) throw new Error("Duplicate section ID was not rejected.");

    const duplicateBlock = clone(updatedHome);
    const duplicateBlockSections = getRecord(duplicateBlock, "duplicate block page").sections as Array<Record<string, unknown>>;
    const firstBlocks = duplicateBlockSections[0].blocks as Array<Record<string, unknown>>;
    firstBlocks[1].blockId = firstBlocks[0].blockId;
    result = await request(baseUrl, "POST", "/api/sites/demo-site/pages/validate", duplicateBlock);
    const duplicateBlockValidation = getRecord(result.json, "duplicate block validation");
    if (duplicateBlockValidation.valid !== false) throw new Error("Duplicate block ID was not rejected.");

    result = await request(baseUrl, "GET", "/api/sites/demo-site/pages/..%2Fbad");
    if (result.response.status !== 400) throw new Error("Unsafe page ID was not rejected.");

    const pageBackups = await fs.readdir(path.join(tempRoot, "sites", "demo-site", "backups", "pages"));
    if (!pageBackups.some((name) => name.startsWith("home.") && name.endsWith(".json"))) {
      throw new Error("Page backup was not created before replacement.");
    }

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

    result = await request(baseUrl, "PUT", "/api/sites/demo-site/custom-css", {
      enabled: true,
      content: ".published-custom-check { color: inherit; }"
    });
    if (!result.response.ok) throw new Error("Valid custom CSS save failed.");

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

    result = await request(baseUrl, "POST", "/api/sites", {
      siteId: "publish-missing",
      siteName: "Publish Missing"
    });
    if (result.response.status !== 201) throw new Error("Publish missing setup failed.");
    await fs.rm(path.join(tempRoot, "sites", "publish-missing", "pages", "home.json"), { force: true });
    result = await request(baseUrl, "POST", "/api/sites/publish-missing/publish", {});
    if (result.response.status !== 400) throw new Error("Publish validation did not catch a missing page.");

    result = await request(baseUrl, "POST", "/api/sites", {
      siteId: "publish-invalid",
      siteName: "Publish Invalid"
    });
    if (result.response.status !== 201) throw new Error("Publish invalid setup failed.");
    const invalidPublishPagePath = path.join(tempRoot, "sites", "publish-invalid", "pages", "home.json");
    const invalidPublishPage = JSON.parse(await fs.readFile(invalidPublishPagePath, "utf8")) as Record<string, unknown>;
    invalidPublishPage.slug = "Bad Slug";
    await fs.writeFile(invalidPublishPagePath, `${JSON.stringify(invalidPublishPage, null, 2)}\n`, "utf8");
    result = await request(baseUrl, "POST", "/api/sites/publish-invalid/publish", {});
    if (result.response.status !== 400) throw new Error("Publish validation did not catch an invalid slug.");

    result = await request(baseUrl, "POST", "/api/sites/demo-site/publish", {});
    if (!result.response.ok) throw new Error("Static publish failed.");
    const publishResult = getRecord(getRecord(result.json, "publish response").publish, "publish payload");
    if (publishResult.previewPath !== "/preview/demo-site/index.html") throw new Error("Publish preview path was not returned.");
    let publishedHtml = await fs.readFile(path.join(tempRoot, "published", "demo-site", "index.html"), "utf8");
    const baseCssIndex = publishedHtml.indexOf("css/ss.css");
    const themeCssIndex = publishedHtml.indexOf("css/theme.css");
    const customCssIndex = publishedHtml.indexOf("css/custom.css");
    if (!(baseCssIndex !== -1 && themeCssIndex > baseCssIndex && customCssIndex > themeCssIndex)) {
      throw new Error("Published CSS load order is incorrect.");
    }
    if (publishedHtml.includes("ss-builder-") || publishedHtml.includes("data-ss-builder-mode")) {
      throw new Error("Published HTML contains builder-only artifacts.");
    }
    if (publishedHtml.includes("js/custom.js")) throw new Error("Custom JS should be excluded by default.");
    let preview = await textRequest(baseUrl, "/preview/demo-site/index.html");
    if (!preview.response.ok || !preview.text.includes("ss-site-page")) throw new Error("Preview endpoint did not serve generated HTML.");

    process.env.CUSTOM_JS_EDITING_ENABLED = "true";
    result = await request(baseUrl, "PUT", "/api/sites/demo-site/custom-js", {
      enabled: true,
      content: "window.phase15CustomJsLoaded = true;"
    });
    if (!result.response.ok) throw new Error("Custom JS setup failed when editing was enabled.");
    process.env.CUSTOM_JS_PUBLISHING_ENABLED = "false";
    result = await request(baseUrl, "POST", "/api/sites/demo-site/publish", { allowCustomJs: true });
    if (!result.response.ok) throw new Error("Publish with custom JS disabled by config failed.");
    publishedHtml = await fs.readFile(path.join(tempRoot, "published", "demo-site", "index.html"), "utf8");
    if (publishedHtml.includes("js/custom.js")) throw new Error("Custom JS was included while publishing was disabled.");
    process.env.CUSTOM_JS_PUBLISHING_ENABLED = "true";
    result = await request(baseUrl, "POST", "/api/sites/demo-site/publish", { allowCustomJs: true });
    if (!result.response.ok) throw new Error("Publish with custom JS allowed failed.");
    publishedHtml = await fs.readFile(path.join(tempRoot, "published", "demo-site", "index.html"), "utf8");
    if (!publishedHtml.includes("js/custom.js")) throw new Error("Custom JS was not included when explicitly enabled and allowed.");
    const customJsOutput = await fs.readFile(path.join(tempRoot, "published", "demo-site", "js", "custom.js"), "utf8");
    if (!customJsOutput.includes("phase15CustomJsLoaded")) throw new Error("Custom JS output file was not written.");
    process.env.CUSTOM_JS_EDITING_ENABLED = "false";
    process.env.CUSTOM_JS_PUBLISHING_ENABLED = "false";

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

  const elementTreeBuilder = await fs.readFile(path.resolve(process.cwd(), "..", "..", "examples", "element-tree-builder.html"), "utf8");
  if (!elementTreeBuilder.includes("/element-operations") || !elementTreeBuilder.includes("../dist/ss.css")) {
    throw new Error("Element tree builder example is missing backend operation wiring or SS CSS.");
  }
  if (!elementTreeBuilder.includes("utilityPicker") || !elementTreeBuilder.includes("saveAttributes") || !elementTreeBuilder.includes("saveContentFields")) {
    throw new Error("Element tree builder example is missing inspector controls.");
  }
  if (!elementTreeBuilder.includes("data-library-type") || !elementTreeBuilder.includes("dragover") || !elementTreeBuilder.includes("dropPlan")) {
    throw new Error("Element tree builder example is missing drag/drop controls.");
  }
  if (!elementTreeBuilder.includes("undoPage") || !elementTreeBuilder.includes("redoPage") || !elementTreeBuilder.includes("data-restore-revision")) {
    throw new Error("Element tree builder example is missing history controls.");
  }
  if (!elementTreeBuilder.includes("resolveAddInsideTarget") || !elementTreeBuilder.includes("Use Add inside")) {
    throw new Error("Element tree builder example is missing compatible add-target handling.");
  }
  if (/bootstrap|tailwind|material-ui/i.test(elementTreeBuilder)) {
    throw new Error("Element tree builder example must not depend on another CSS framework.");
  }

    console.log("Phase 21 verification passed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
