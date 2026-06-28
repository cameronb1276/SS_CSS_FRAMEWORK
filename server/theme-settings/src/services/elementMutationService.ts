import { BlockDocument, BlockType, PageDocument, SectionDocument, SectionType } from "../types/content";
import { ElementType } from "../types/elements";
import { elementRegistry, elementTypeExists, canContain } from "../registry/elementRegistry";
import { badRequest } from "../utils/errors";
import { validateContentId } from "../validation/contentValidation";
import { validateAttributes, validateClassList, validateElementTree } from "../validation/elementTreeValidation";
import { pageToElementTree } from "./elementTreeService";
import { readPage, updatePage } from "./contentService";
import { createRevisionSnapshot } from "./revisionService";

type Position = "inside" | "before" | "after";
type OperationName = "add" | "patch" | "delete" | "duplicate" | "move" | "rename" | "set-visibility" | "set-locked";

type ElementOperation = {
  operation: OperationName;
  elementType?: ElementType;
  elementId?: string;
  newElementId?: string;
  parentId?: string;
  siblingId?: string;
  targetParentId?: string;
  position?: Position;
  index?: number;
  patch?: Record<string, unknown>;
  label?: string;
  hidden?: boolean;
  locked?: boolean;
};

export type ElementOperationResult = {
  operation: OperationName;
  selectedElementId: string | null;
  page: PageDocument;
  issues: ReturnType<typeof validateElementTree>;
};

function assertObject(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw badRequest(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function rejectUnknown(obj: Record<string, unknown>, allowed: string[], label: string): void {
  const unknown = Object.keys(obj).filter((key) => !allowed.includes(key));
  if (unknown.length) throw badRequest(`${label} contains unsupported fields.`, unknown);
}

function parseOperation(input: unknown): ElementOperation {
  const obj = assertObject(input, "element operation");
  rejectUnknown(obj, ["operation", "elementType", "elementId", "newElementId", "parentId", "siblingId", "targetParentId", "position", "index", "patch", "label", "hidden", "locked"], "element operation");
  const operation = obj.operation;
  if (typeof operation !== "string" || !["add", "patch", "delete", "duplicate", "move", "rename", "set-visibility", "set-locked"].includes(operation)) {
    throw badRequest("element operation must be a supported operation name.");
  }
  const parsed: ElementOperation = { operation: operation as OperationName };
  for (const key of ["elementId", "newElementId", "parentId", "siblingId", "targetParentId"] as const) {
    if (obj[key] !== undefined) parsed[key] = validateContentId(obj[key], key);
  }
  if (obj.elementType !== undefined) {
    if (typeof obj.elementType !== "string" || !elementTypeExists(obj.elementType)) throw badRequest("elementType is not registered.");
    parsed.elementType = obj.elementType;
  }
  if (obj.position !== undefined) {
    if (typeof obj.position !== "string" || !["inside", "before", "after"].includes(obj.position)) throw badRequest("position must be inside, before, or after.");
    parsed.position = obj.position as Position;
  }
  if (obj.index !== undefined) {
    if (typeof obj.index !== "number" || !Number.isInteger(obj.index) || obj.index < 0 || obj.index > 1000) throw badRequest("index must be a safe non-negative integer.");
    parsed.index = obj.index;
  }
  if (obj.patch !== undefined) parsed.patch = assertObject(obj.patch, "operation patch");
  if (obj.label !== undefined) {
    if (typeof obj.label !== "string" || obj.label.trim().length === 0 || obj.label.length > 120) throw badRequest("label must be 1 to 120 characters.");
    parsed.label = obj.label.trim();
  }
  if (obj.hidden !== undefined) {
    if (typeof obj.hidden !== "boolean") throw badRequest("hidden must be boolean.");
    parsed.hidden = obj.hidden;
  }
  if (obj.locked !== undefined) {
    if (typeof obj.locked !== "boolean") throw badRequest("locked must be boolean.");
    parsed.locked = obj.locked;
  }
  return parsed;
}

function rootId(page: PageDocument): string {
  return `page-${page.pageId}`;
}

function sectionElementType(section: SectionDocument): ElementType {
  return "section";
}

function blockElementType(block: BlockDocument): ElementType {
  const map: Record<BlockType, ElementType> = {
    heading: "heading",
    text: "paragraph",
    button: "button",
    image: "image",
    card: block.style.variant === "service" ? "service-card" : "card",
    list: "list",
    "form-placeholder": "form",
    "map-placeholder": "map-embed",
    "business-hours": "business-hours",
    testimonial: "testimonial-card",
    "custom-html": "custom-html"
  };
  return map[block.type];
}

function blockTypeFromElement(type: ElementType): BlockType {
  const map: Partial<Record<ElementType, BlockType>> = {
    heading: "heading",
    paragraph: "text",
    "rich-text": "text",
    list: "list",
    quote: "text",
    badge: "text",
    button: "button",
    link: "button",
    image: "image",
    "map-embed": "map-placeholder",
    form: "form-placeholder",
    "business-hours": "business-hours",
    "testimonial-card": "testimonial",
    "service-card": "card",
    card: "card",
    "custom-html": "custom-html"
  };
  return map[type] ?? "card";
}

function sectionTypeFromElement(type: ElementType, content: Record<string, unknown>): SectionType {
  if (type !== "section") throw badRequest(`${type} cannot be inserted at page root.`);
  const requested = content.sectionType;
  if (typeof requested === "string" && ["hero", "services", "about", "pricing", "testimonials", "faq", "gallery", "contact", "cta", "footer", "custom"].includes(requested)) {
    return requested as SectionType;
  }
  return "custom";
}

function findSection(page: PageDocument, elementId: string): SectionDocument | undefined {
  return page.sections.find((section) => section.sectionId === elementId);
}

function findBlock(page: PageDocument, elementId: string): { section: SectionDocument; block: BlockDocument; index: number } | undefined {
  for (const section of page.sections) {
    const index = section.blocks.findIndex((block) => block.blockId === elementId);
    if (index !== -1) return { section, block: section.blocks[index], index };
  }
  return undefined;
}

function elementTypeOf(page: PageDocument, elementId: string): ElementType {
  if (elementId === rootId(page)) return "page-root";
  const section = findSection(page, elementId);
  if (section) return sectionElementType(section);
  const block = findBlock(page, elementId);
  if (block) return blockElementType(block.block);
  throw badRequest(`Element not found: ${elementId}`);
}

function ensureUniqueId(page: PageDocument, elementId: string): void {
  if (elementId === rootId(page) || findSection(page, elementId) || findBlock(page, elementId)) {
    throw badRequest(`Element ID already exists: ${elementId}`);
  }
}

function defaultElementId(page: PageDocument, type: ElementType): string {
  let index = 1;
  while (true) {
    const id = `${type.replace(/[^a-z0-9]+/g, "-")}-${index}`;
    if (id !== rootId(page) && !findSection(page, id) && !findBlock(page, id)) return id;
    index += 1;
  }
}

function classNameFromPatch(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  const classes = Array.isArray(value) ? value.map(String) : typeof value === "string" ? value.split(/\s+/).filter(Boolean) : [];
  const issues = validateClassList(classes, "patch.classes");
  if (issues.length) throw badRequest(issues[0].message);
  return Array.from(new Set(classes)).join(" ");
}

function applyPatchToBlock(block: BlockDocument, patch: Record<string, unknown>): void {
  rejectUnknown(patch, ["label", "content", "design", "classes", "attributes", "hidden", "locked"], "element patch");
  if (block.locked && patch.locked !== false) throw badRequest("Locked elements cannot be edited until unlocked.");
  if (patch.label !== undefined) {
    if (typeof patch.label !== "string" || patch.label.trim().length === 0 || patch.label.length > 120) throw badRequest("label must be 1 to 120 characters.");
    block.label = patch.label.trim();
  }
  if (patch.content !== undefined) {
    const content = assertObject(patch.content, "patch.content");
    block.content = { ...block.content, ...content };
    if (typeof content.href === "string") block.link = { href: content.href, label: String(content.text ?? block.label), target: content.target === "_blank" ? "_blank" : "_self" };
    if (typeof content.src === "string") block.media = { src: content.src, alt: String(content.alt ?? "") };
  }
  if (patch.design !== undefined) {
    const design = assertObject(patch.design, "patch.design");
    for (const [key, value] of Object.entries(design)) {
      if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") block.style[key] = value;
    }
  }
  if (patch.classes !== undefined) {
    block.style.className = classNameFromPatch(patch.classes) ?? "";
  }
  if (patch.attributes !== undefined) {
    const attributes = Object.fromEntries(Object.entries(assertObject(patch.attributes, "patch.attributes")).map(([key, value]) => [key, String(value)]));
    const issues = validateAttributes(attributes, "patch.attributes");
    if (issues.length) throw badRequest(issues[0].message);
    for (const [key, value] of Object.entries(attributes)) block.style[`attr:${key}`] = value;
  }
  if (patch.hidden !== undefined) {
    if (typeof patch.hidden !== "boolean") throw badRequest("hidden must be boolean.");
    block.hidden = patch.hidden;
  }
  if (patch.locked !== undefined) {
    if (typeof patch.locked !== "boolean") throw badRequest("locked must be boolean.");
    block.locked = patch.locked;
  }
}

function createBlock(page: PageDocument, type: ElementType, elementId?: string): BlockDocument {
  const registry = elementRegistry[type];
  const blockId = elementId ?? defaultElementId(page, type);
  ensureUniqueId(page, blockId);
  const blockType = blockTypeFromElement(type);
  return {
    blockId,
    type: blockType,
    label: registry.label,
    content: { ...registry.defaultContent },
    hidden: false,
    locked: false,
    validation: { status: "valid", messages: [] },
    style: type === "service-card" ? { variant: "service" } : {}
  };
}

function createSection(page: PageDocument, type: ElementType, elementId?: string): SectionDocument {
  const registry = elementRegistry[type];
  const sectionId = elementId ?? defaultElementId(page, "section");
  ensureUniqueId(page, sectionId);
  return {
    sectionId,
    type: sectionTypeFromElement(type, registry.defaultContent),
    displayName: registry.label,
    locked: false,
    hidden: false,
    stylePreset: "plain",
    layoutPreset: "wide",
    spacingPreset: "comfortable",
    background: "default",
    blockOrder: [],
    blocks: []
  };
}

function insertIndex(length: number, position: Position | undefined, index: number | undefined): number {
  if (position !== "inside") return length;
  if (index === undefined) return length;
  return Math.min(length, Math.max(0, index));
}

function addElement(page: PageDocument, operation: ElementOperation): string {
  if (!operation.elementType) throw badRequest("add requires elementType.");
  if (!operation.parentId && !operation.siblingId) throw badRequest("add requires parentId or siblingId.");
  const newId = operation.newElementId ?? defaultElementId(page, operation.elementType);

  if (operation.siblingId && operation.position !== "inside") {
    const sectionSibling = findSection(page, operation.siblingId);
    if (sectionSibling) {
      if (!canContain("page-root", operation.elementType)) throw badRequest(`page-root cannot contain ${operation.elementType}.`);
      const section = createSection(page, operation.elementType, newId);
      const siblingIndex = page.sectionOrder.indexOf(operation.siblingId);
      const at = operation.position === "before" ? siblingIndex : siblingIndex + 1;
      page.sections.splice(at, 0, section);
      page.sectionOrder.splice(at, 0, section.sectionId);
      return section.sectionId;
    }
    const sibling = findBlock(page, operation.siblingId);
    if (!sibling) throw badRequest("siblingId was not found.");
    if (!canContain("section", operation.elementType)) throw badRequest(`section cannot contain ${operation.elementType}.`);
    const block = createBlock(page, operation.elementType, newId);
    const at = operation.position === "before" ? sibling.index : sibling.index + 1;
    sibling.section.blocks.splice(at, 0, block);
    sibling.section.blockOrder.splice(at, 0, block.blockId);
    return block.blockId;
  }

  const parentId = operation.parentId ?? rootId(page);
  const parentType = elementTypeOf(page, parentId);
  if (!canContain(parentType, operation.elementType)) throw badRequest(`${parentType} cannot contain ${operation.elementType}.`);
  if (parentType === "page-root") {
    const section = createSection(page, operation.elementType, newId);
    const at = insertIndex(page.sections.length, operation.position, operation.index);
    page.sections.splice(at, 0, section);
    page.sectionOrder.splice(at, 0, section.sectionId);
    return section.sectionId;
  }
  const parentSection = findSection(page, parentId);
  if (!parentSection) throw badRequest("Only sections can currently accept inserted child blocks.");
  const block = createBlock(page, operation.elementType, newId);
  const at = insertIndex(parentSection.blocks.length, operation.position, operation.index);
  parentSection.blocks.splice(at, 0, block);
  parentSection.blockOrder.splice(at, 0, block.blockId);
  return block.blockId;
}

function deleteElement(page: PageDocument, elementId: string): void {
  if (elementId === rootId(page)) throw badRequest("Page root cannot be deleted.");
  const section = findSection(page, elementId);
  if (section) {
    if (section.locked) throw badRequest("Locked sections cannot be deleted.");
    page.sections = page.sections.filter((item) => item.sectionId !== elementId);
    page.sectionOrder = page.sectionOrder.filter((id) => id !== elementId);
    return;
  }
  const found = findBlock(page, elementId);
  if (!found) throw badRequest("Element not found.");
  if (found.block.locked) throw badRequest("Locked elements cannot be deleted.");
  found.section.blocks.splice(found.index, 1);
  found.section.blockOrder = found.section.blockOrder.filter((id) => id !== elementId);
}

function duplicateId(page: PageDocument, baseId: string): string {
  let index = 1;
  while (true) {
    const id = `${baseId}-copy-${index}`;
    if (!findSection(page, id) && !findBlock(page, id) && id !== rootId(page)) return id;
    index += 1;
  }
}

function duplicateElement(page: PageDocument, elementId: string): string {
  const section = findSection(page, elementId);
  if (section) {
    if (section.locked) throw badRequest("Locked sections cannot be duplicated.");
    const clone = JSON.parse(JSON.stringify(section)) as SectionDocument;
    clone.sectionId = duplicateId(page, section.sectionId);
    clone.displayName = `${section.displayName} copy`;
    clone.blocks = clone.blocks.map((block) => ({ ...block, blockId: duplicateId(page, block.blockId), label: `${block.label} copy` }));
    clone.blockOrder = clone.blocks.map((block) => block.blockId);
    const at = page.sectionOrder.indexOf(section.sectionId) + 1;
    page.sections.splice(at, 0, clone);
    page.sectionOrder.splice(at, 0, clone.sectionId);
    return clone.sectionId;
  }
  const found = findBlock(page, elementId);
  if (!found) throw badRequest("Element not found.");
  if (found.block.locked) throw badRequest("Locked elements cannot be duplicated.");
  const clone = JSON.parse(JSON.stringify(found.block)) as BlockDocument;
  clone.blockId = duplicateId(page, found.block.blockId);
  clone.label = `${found.block.label} copy`;
  found.section.blocks.splice(found.index + 1, 0, clone);
  found.section.blockOrder.splice(found.index + 1, 0, clone.blockId);
  return clone.blockId;
}

function moveElement(page: PageDocument, operation: ElementOperation): string {
  if (!operation.elementId) throw badRequest("move requires elementId.");
  if (operation.elementId === rootId(page)) throw badRequest("Page root cannot be moved.");
  const found = findBlock(page, operation.elementId);
  if (!found) throw badRequest("Only block moves are supported in this phase.");
  if (found.block.locked) throw badRequest("Locked elements cannot be moved.");
  const targetParentId = operation.targetParentId ?? operation.parentId ?? found.section.sectionId;
  const targetSection = findSection(page, targetParentId);
  if (!targetSection) throw badRequest("targetParentId must be a section.");
  if (!canContain("section", blockElementType(found.block))) throw badRequest("Target section cannot contain this element.");
  found.section.blocks.splice(found.index, 1);
  found.section.blockOrder = found.section.blockOrder.filter((id) => id !== found.block.blockId);
  let at = targetSection.blocks.length;
  if (operation.siblingId) {
    const siblingIndex = targetSection.blocks.findIndex((block) => block.blockId === operation.siblingId);
    if (siblingIndex === -1) throw badRequest("siblingId was not found in target parent.");
    at = operation.position === "before" ? siblingIndex : siblingIndex + 1;
  } else if (operation.index !== undefined) {
    at = Math.min(targetSection.blocks.length, Math.max(0, operation.index));
  }
  targetSection.blocks.splice(at, 0, found.block);
  targetSection.blockOrder.splice(at, 0, found.block.blockId);
  return found.block.blockId;
}

function validateResult(page: PageDocument): void {
  const issues = validateElementTree(pageToElementTree(page), { published: true });
  if (issues.length) throw badRequest("Element operation produced an invalid page tree.", issues);
}

export async function applyElementOperation(siteId: string, pageId: string, input: unknown): Promise<ElementOperationResult> {
  const operation = parseOperation(input);
  const page = await readPage(siteId, pageId);
  const originalPage = JSON.parse(JSON.stringify(page)) as PageDocument;
  let selectedElementId: string | null = operation.elementId ?? null;

  switch (operation.operation) {
    case "add":
      selectedElementId = addElement(page, operation);
      break;
    case "patch": {
      if (!operation.elementId || !operation.patch) throw badRequest("patch requires elementId and patch.");
      const block = findBlock(page, operation.elementId);
      if (!block) throw badRequest("Only block patching is supported in this phase.");
      applyPatchToBlock(block.block, operation.patch);
      selectedElementId = block.block.blockId;
      break;
    }
    case "rename": {
      if (!operation.elementId || !operation.label) throw badRequest("rename requires elementId and label.");
      const section = findSection(page, operation.elementId);
      if (section) {
        if (section.locked) throw badRequest("Locked sections cannot be renamed.");
        section.displayName = operation.label;
      } else {
        const block = findBlock(page, operation.elementId);
        if (!block) throw badRequest("Element not found.");
        if (block.block.locked) throw badRequest("Locked elements cannot be renamed.");
        block.block.label = operation.label;
      }
      selectedElementId = operation.elementId;
      break;
    }
    case "set-visibility": {
      if (!operation.elementId || operation.hidden === undefined) throw badRequest("set-visibility requires elementId and hidden.");
      const section = findSection(page, operation.elementId);
      if (section) section.hidden = operation.hidden;
      else {
        const block = findBlock(page, operation.elementId);
        if (!block) throw badRequest("Element not found.");
        block.block.hidden = operation.hidden;
      }
      selectedElementId = operation.elementId;
      break;
    }
    case "set-locked": {
      if (!operation.elementId || operation.locked === undefined) throw badRequest("set-locked requires elementId and locked.");
      const section = findSection(page, operation.elementId);
      if (section) section.locked = operation.locked;
      else {
        const block = findBlock(page, operation.elementId);
        if (!block) throw badRequest("Element not found.");
        block.block.locked = operation.locked;
      }
      selectedElementId = operation.elementId;
      break;
    }
    case "delete":
      if (!operation.elementId) throw badRequest("delete requires elementId.");
      deleteElement(page, operation.elementId);
      selectedElementId = null;
      break;
    case "duplicate":
      if (!operation.elementId) throw badRequest("duplicate requires elementId.");
      selectedElementId = duplicateElement(page, operation.elementId);
      break;
    case "move":
      selectedElementId = moveElement(page, operation);
      break;
  }

  page.updatedAt = new Date().toISOString();
  validateResult(page);
  await createRevisionSnapshot(siteId, pageId, originalPage, {
    operation: `element.${operation.operation}`,
    targetElementId: operation.elementId ?? selectedElementId,
    summary: `Element operation: ${operation.operation}`
  });
  const saved = await updatePage(siteId, pageId, page);
  const issues = validateElementTree(pageToElementTree(saved), { published: true });
  return { operation: operation.operation, selectedElementId, page: saved, issues };
}
