import { BlockDocument, PageDocument, SectionDocument } from "../types/content";
import { ElementDesign, ElementNode, ElementType } from "../types/elements";
import { elementRegistry, elementTypeExists } from "../registry/elementRegistry";

function blockElementType(block: BlockDocument): ElementType {
  const map: Record<string, ElementType> = {
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
  return map[block.type] ?? "paragraph";
}

function designFromSection(section: SectionDocument): ElementDesign {
  return {
    spacing: section.spacingPreset,
    background: section.background,
    width: section.layoutPreset === "centered" ? "narrow" : "wide",
    variant: section.stylePreset
  };
}

function designFromBlock(block: BlockDocument): ElementDesign {
  const design: ElementDesign = {};
  if (typeof block.style.variant === "string") design.variant = block.style.variant;
  if (typeof block.style.align === "string" && ["start", "center", "end"].includes(block.style.align)) {
    design.align = block.style.align as ElementDesign["align"];
  }
  return design;
}

function customClassesFromStyle(style: Record<string, string | number | boolean | null>): string[] {
  if (typeof style.className !== "string") return [];
  return style.className.split(/\s+/).map((item) => item.trim()).filter(Boolean);
}

function attributesFromStyle(style: Record<string, string | number | boolean | null>): Record<string, string> {
  const attributes: Record<string, string> = {};
  for (const [key, value] of Object.entries(style)) {
    if (!key.startsWith("attr:") || typeof value !== "string") continue;
    attributes[key.slice("attr:".length)] = value;
  }
  return attributes;
}

function blockContent(block: BlockDocument): Record<string, unknown> {
  const content = { ...block.content };
  if (block.link) {
    content.href = block.link.href;
    content.target = block.link.target;
  }
  if (block.media) {
    content.src = block.media.src;
    content.alt = block.media.alt;
  }
  return content;
}

function sectionNode(section: SectionDocument, parentId: string, timestamps: { createdAt: string; updatedAt: string }): ElementNode {
  const children = section.blockOrder
    .map((blockId) => section.blocks.find((block) => block.blockId === blockId))
    .filter((block): block is BlockDocument => Boolean(block))
    .map((block) => blockNode(block, section.sectionId, timestamps));
  return {
    elementId: section.sectionId,
    label: section.displayName,
    type: "section",
    parentId,
    children,
    content: { sectionType: section.type },
    design: designFromSection(section),
    classes: { system: elementRegistry.section.defaultClasses, custom: [] },
    attributes: {},
    visibility: { hidden: section.hidden },
    locked: section.locked,
    metadata: { source: "section", createdAt: timestamps.createdAt, updatedAt: timestamps.updatedAt }
  };
}

function blockNode(block: BlockDocument, parentId: string, timestamps: { createdAt: string; updatedAt: string }): ElementNode {
  const type = blockElementType(block);
  return {
    elementId: block.blockId,
    label: block.label,
    type,
    parentId,
    children: [],
    content: blockContent(block),
    design: designFromBlock(block),
    classes: { system: elementRegistry[type].defaultClasses, custom: customClassesFromStyle(block.style) },
    attributes: attributesFromStyle(block.style),
    visibility: { hidden: block.hidden },
    locked: block.locked,
    metadata: { source: "block", createdAt: timestamps.createdAt, updatedAt: timestamps.updatedAt }
  };
}

export function pageToElementTree(page: PageDocument): ElementNode {
  const rootId = `page-${page.pageId}`;
  const timestamps = { createdAt: page.createdAt, updatedAt: page.updatedAt };
  const children = page.sectionOrder
    .map((sectionId) => page.sections.find((section) => section.sectionId === sectionId))
    .filter((section): section is SectionDocument => Boolean(section))
    .map((section) => sectionNode(section, rootId, timestamps));
  return {
    elementId: rootId,
    label: page.title,
    type: "page-root",
    parentId: null,
    children,
    content: { pageId: page.pageId, slug: page.slug, status: page.status },
    design: {},
    classes: { system: elementRegistry["page-root"].defaultClasses, custom: [] },
    attributes: {},
    visibility: { hidden: false },
    locked: false,
    metadata: { source: "page", createdAt: page.createdAt, updatedAt: page.updatedAt }
  };
}

export function flattenElementTree(root: ElementNode): ElementNode[] {
  return [root, ...root.children.flatMap(flattenElementTree)];
}

export function findElement(root: ElementNode, elementId: string): ElementNode | undefined {
  if (root.elementId === elementId) return root;
  for (const child of root.children) {
    const found = findElement(child, elementId);
    if (found) return found;
  }
  return undefined;
}

export function elementRegistryForApi() {
  return Object.values(elementRegistry).map((item) => ({
    type: item.type,
    label: item.label,
    category: item.category,
    canHaveChildren: item.canHaveChildren,
    allowedChildren: item.allowedChildren,
    allowedParents: item.allowedParents,
    defaultContent: item.defaultContent,
    defaultDesign: item.defaultDesign,
    defaultClasses: item.defaultClasses,
    editableFields: item.editableFields,
    requiredFields: item.requiredFields,
    renderCategory: item.renderCategory,
    safeForPublish: item.safeForPublish,
    builderOnly: item.builderOnly
  })).filter((entry) => elementTypeExists(entry.type));
}
