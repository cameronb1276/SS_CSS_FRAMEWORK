import { customHtmlBlocksEnabled } from "../config";
import {
  BlockDocument,
  BlockType,
  PageDocument,
  PageStatus,
  SectionDocument,
  SectionType,
  SiteContentIndex
} from "../types/content";
import { badRequest } from "../utils/errors";
import { validateSiteId } from "./siteId";

const SAFE_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const sectionTypes: SectionType[] = ["hero", "services", "about", "pricing", "testimonials", "faq", "gallery", "contact", "cta", "footer", "custom"];
const blockTypes: BlockType[] = ["heading", "text", "button", "image", "card", "list", "form-placeholder", "map-placeholder", "business-hours", "testimonial", "custom-html"];
const pageStatuses: PageStatus[] = ["draft", "published"];

type MutableObject = Record<string, unknown>;

function assertObject(value: unknown, label: string): MutableObject {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw badRequest(`${label} must be an object.`);
  }
  return value as MutableObject;
}

function rejectUnknown(obj: MutableObject, allowed: string[], label: string): void {
  const unknown = Object.keys(obj).filter((key) => !allowed.includes(key));
  if (unknown.length) throw badRequest(`${label} contains unsupported fields.`, unknown);
}

export function validateContentId(value: unknown, label: string): string {
  if (typeof value !== "string") throw badRequest(`${label} must be a string.`);
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    throw badRequest(`${label} is not valid URL text.`);
  }
  if (decoded !== value || decoded.length < 2 || decoded.length > 80 || !SAFE_ID.test(decoded)) {
    throw badRequest(`${label} must use lowercase letters, numbers, and hyphens only.`);
  }
  if (decoded.includes("..") || decoded.includes("/") || decoded.includes("\\") || decoded.trim() !== decoded) {
    throw badRequest(`${label} contains unsafe path characters.`);
  }
  return decoded;
}

export function validatePageSlug(value: unknown): string {
  if (typeof value !== "string" || value.length < 1 || value.length > 100 || !SAFE_SLUG.test(value)) {
    throw badRequest("page.slug must be URL-friendly lowercase text using letters, numbers, and hyphens.");
  }
  return value;
}

function stringValue(value: unknown, label: string, max = 160): string {
  if (typeof value !== "string" || value.trim().length === 0 || value.length > max) {
    throw badRequest(`${label} must be a non-empty string up to ${max} characters.`);
  }
  return value.trim();
}

function optionalString(value: unknown, label: string, max = 300): string {
  if (value === undefined) return "";
  if (typeof value !== "string" || value.length > max) {
    throw badRequest(`${label} must be a string up to ${max} characters.`);
  }
  return value.trim();
}

function booleanValue(value: unknown, label: string): boolean {
  if (typeof value !== "boolean") throw badRequest(`${label} must be boolean.`);
  return value;
}

function numberValue(value: unknown, label: string, min = 0, max = 10_000): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < min || value > max) {
    throw badRequest(`${label} must be an integer between ${min} and ${max}.`);
  }
  return value;
}

function enumValue<T extends string>(value: unknown, label: string, allowed: T[]): T {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw badRequest(`${label} must be one of: ${allowed.join(", ")}.`);
  }
  return value as T;
}

function isoValue(value: unknown, label: string): string {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    throw badRequest(`${label} must be an ISO date string.`);
  }
  return value;
}

function validateMetadata(value: unknown, label: string): Record<string, string | number | boolean | null> {
  const obj = assertObject(value, label);
  const result: Record<string, string | number | boolean | null> = {};
  for (const [key, item] of Object.entries(obj)) {
    if (!/^[a-zA-Z0-9_-]{1,60}$/.test(key)) throw badRequest(`${label} has an unsafe metadata key.`);
    if (item !== null && typeof item !== "string" && typeof item !== "number" && typeof item !== "boolean") {
      throw badRequest(`${label}.${key} must be a primitive value.`);
    }
    if (typeof item === "string" && item.length > 500) throw badRequest(`${label}.${key} is too long.`);
    result[key] = item;
  }
  return result;
}

function validateContentFields(value: unknown, blockType: BlockType): Record<string, unknown> {
  const obj = assertObject(value, "block.content");
  const text = JSON.stringify(obj);
  if (text.length > 20_000) throw badRequest("block.content is too large.");
  for (const item of Object.values(obj)) {
    if (typeof item === "string" && item.length > 2_000) {
      throw badRequest("block.content string fields must be 2000 characters or fewer.");
    }
  }
  if (blockType === "custom-html" && !customHtmlBlocksEnabled()) {
    throw badRequest("custom-html blocks are disabled by default.");
  }
  if (blockType !== "custom-html" && "html" in obj) {
    throw badRequest("Raw HTML content is only allowed in explicitly enabled custom-html blocks.");
  }
  return obj;
}

function validateMedia(value: unknown): BlockDocument["media"] | undefined {
  if (value === undefined) return undefined;
  const obj = assertObject(value, "block.media");
  rejectUnknown(obj, ["src", "alt"], "block.media");
  const src = stringValue(obj.src, "block.media.src", 240);
  if (src.includes("..") || src.includes("\\") || src.startsWith("/") || /^[a-z]+:/i.test(src) && !src.startsWith("https://")) {
    throw badRequest("block.media.src must be an https URL or safe site-relative asset path.");
  }
  return { src, alt: optionalString(obj.alt, "block.media.alt", 180) };
}

function validateLink(value: unknown): BlockDocument["link"] | undefined {
  if (value === undefined) return undefined;
  const obj = assertObject(value, "block.link");
  rejectUnknown(obj, ["href", "label", "target"], "block.link");
  const href = stringValue(obj.href, "block.link.href", 240);
  if (href.includes("\n") || href.includes("\r") || href.toLowerCase().startsWith("javascript:")) {
    throw badRequest("block.link.href is unsafe.");
  }
  return {
    href,
    label: stringValue(obj.label, "block.link.label", 120),
    target: enumValue(obj.target, "block.link.target", ["_self", "_blank"])
  };
}

function validateBlock(value: unknown): BlockDocument {
  const obj = assertObject(value, "block");
  rejectUnknown(obj, ["blockId", "type", "label", "content", "hidden", "locked", "validation", "style", "link", "media"], "block");
  const type = enumValue(obj.type, "block.type", blockTypes);
  const validation = assertObject(obj.validation, "block.validation");
  rejectUnknown(validation, ["status", "messages"], "block.validation");
  const messages = Array.isArray(validation.messages) ? validation.messages.map((message) => stringValue(message, "block.validation.messages", 220)) : [];
  if (messages.length > 10) throw badRequest("block.validation.messages can include up to 10 messages.");
  return {
    blockId: validateContentId(obj.blockId, "block.blockId"),
    type,
    label: stringValue(obj.label, "block.label", 120),
    content: validateContentFields(obj.content, type),
    hidden: booleanValue(obj.hidden, "block.hidden"),
    locked: booleanValue(obj.locked, "block.locked"),
    validation: {
      status: enumValue(validation.status, "block.validation.status", ["valid", "warning", "invalid"]),
      messages
    },
    style: validateMetadata(obj.style, "block.style"),
    link: validateLink(obj.link),
    media: validateMedia(obj.media)
  };
}

function validateSection(value: unknown): SectionDocument {
  const obj = assertObject(value, "section");
  rejectUnknown(obj, ["sectionId", "type", "displayName", "locked", "hidden", "stylePreset", "layoutPreset", "spacingPreset", "background", "blockOrder", "blocks"], "section");
  const blocks = Array.isArray(obj.blocks) ? obj.blocks.map(validateBlock) : [];
  const blockIds = new Set<string>();
  for (const block of blocks) {
    if (blockIds.has(block.blockId)) throw badRequest(`Duplicate block ID: ${block.blockId}`);
    blockIds.add(block.blockId);
  }
  const blockOrder = Array.isArray(obj.blockOrder) ? obj.blockOrder.map((id) => validateContentId(id, "section.blockOrder")) : blocks.map((block) => block.blockId);
  for (const id of blockOrder) {
    if (!blockIds.has(id)) throw badRequest(`section.blockOrder references unknown block ID: ${id}`);
  }
  return {
    sectionId: validateContentId(obj.sectionId, "section.sectionId"),
    type: enumValue(obj.type, "section.type", sectionTypes),
    displayName: stringValue(obj.displayName, "section.displayName", 120),
    locked: booleanValue(obj.locked, "section.locked"),
    hidden: booleanValue(obj.hidden, "section.hidden"),
    stylePreset: enumValue(obj.stylePreset, "section.stylePreset", ["plain", "soft", "tinted", "dark", "bordered"]),
    layoutPreset: enumValue(obj.layoutPreset, "section.layoutPreset", ["single", "split", "grid", "centered", "wide"]),
    spacingPreset: enumValue(obj.spacingPreset, "section.spacingPreset", ["compact", "comfortable", "spacious"]),
    background: enumValue(obj.background, "section.background", ["default", "surface", "soft", "primary-soft", "accent-soft", "dark"]),
    blockOrder,
    blocks
  };
}

export function validatePageDocument(value: unknown): PageDocument {
  const obj = assertObject(value, "page");
  rejectUnknown(obj, ["schemaVersion", "pageId", "title", "slug", "seo", "status", "createdAt", "updatedAt", "navigation", "sectionOrder", "sections", "metadata"], "page");
  if (obj.schemaVersion !== 1) throw badRequest("page.schemaVersion must be 1.");
  const seo = assertObject(obj.seo, "page.seo");
  rejectUnknown(seo, ["title", "description"], "page.seo");
  const navigation = assertObject(obj.navigation, "page.navigation");
  rejectUnknown(navigation, ["label", "order", "showInNavigation"], "page.navigation");
  const sections = Array.isArray(obj.sections) ? obj.sections.map(validateSection) : [];
  const sectionIds = new Set<string>();
  const blockIds = new Set<string>();
  for (const section of sections) {
    if (sectionIds.has(section.sectionId)) throw badRequest(`Duplicate section ID: ${section.sectionId}`);
    sectionIds.add(section.sectionId);
    for (const block of section.blocks) {
      if (blockIds.has(block.blockId)) throw badRequest(`Duplicate block ID: ${block.blockId}`);
      blockIds.add(block.blockId);
    }
  }
  const sectionOrder = Array.isArray(obj.sectionOrder) ? obj.sectionOrder.map((id) => validateContentId(id, "page.sectionOrder")) : sections.map((section) => section.sectionId);
  for (const id of sectionOrder) {
    if (!sectionIds.has(id)) throw badRequest(`page.sectionOrder references unknown section ID: ${id}`);
  }
  return {
    schemaVersion: 1,
    pageId: validateContentId(obj.pageId, "page.pageId"),
    title: stringValue(obj.title, "page.title", 160),
    slug: validatePageSlug(obj.slug),
    seo: {
      title: optionalString(seo.title, "page.seo.title", 180),
      description: optionalString(seo.description, "page.seo.description", 300)
    },
    status: enumValue(obj.status, "page.status", pageStatuses),
    createdAt: isoValue(obj.createdAt, "page.createdAt"),
    updatedAt: isoValue(obj.updatedAt, "page.updatedAt"),
    navigation: {
      label: stringValue(navigation.label, "page.navigation.label", 80),
      order: numberValue(navigation.order, "page.navigation.order"),
      showInNavigation: booleanValue(navigation.showInNavigation, "page.navigation.showInNavigation")
    },
    sectionOrder,
    sections,
    metadata: validateMetadata(obj.metadata, "page.metadata")
  };
}

export function validateSiteContentIndex(value: unknown): SiteContentIndex {
  const obj = assertObject(value, "site content index");
  rejectUnknown(obj, ["schemaVersion", "siteId", "defaultPageId", "pageOrder", "publishedStatus", "createdAt", "updatedAt"], "site content index");
  if (obj.schemaVersion !== 1) throw badRequest("site content index schemaVersion must be 1.");
  return {
    schemaVersion: 1,
    siteId: validateSiteId(obj.siteId),
    defaultPageId: validateContentId(obj.defaultPageId, "site content index.defaultPageId"),
    pageOrder: Array.isArray(obj.pageOrder) ? obj.pageOrder.map((id) => validateContentId(id, "site content index.pageOrder")) : [],
    publishedStatus: enumValue(obj.publishedStatus, "site content index.publishedStatus", pageStatuses),
    createdAt: isoValue(obj.createdAt, "site content index.createdAt"),
    updatedAt: isoValue(obj.updatedAt, "site content index.updatedAt")
  };
}
