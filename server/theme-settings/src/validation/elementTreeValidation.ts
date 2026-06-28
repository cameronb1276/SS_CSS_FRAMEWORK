import { canContain, elementRegistry } from "../registry/elementRegistry";
import { ElementNode, ElementTreeValidationIssue } from "../types/elements";

const SAFE_CLASS = /^-?[_a-zA-Z]+[_a-zA-Z0-9-:\/]*$/;
const SAFE_ATTRIBUTE = /^(id|title|aria-[a-z0-9-]+|data-ss-[a-z0-9-]+)$/;
const SAFE_ELEMENT_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function issue(path: string, message: string, elementId?: string): ElementTreeValidationIssue {
  return { path, message, elementId };
}

function isUnsafeUrl(value: string): boolean {
  return value.trim().toLowerCase().startsWith("javascript:");
}

export function validateClassList(classes: string[], path = "classes"): ElementTreeValidationIssue[] {
  const seen = new Set<string>();
  const issues: ElementTreeValidationIssue[] = [];
  for (const className of classes) {
    if (!className || !SAFE_CLASS.test(className)) issues.push(issue(path, `Malformed class name: ${className}`));
    if (seen.has(className)) issues.push(issue(path, `Duplicate class name: ${className}`));
    seen.add(className);
  }
  return issues;
}

export function validateAttributes(attributes: Record<string, string>, path = "attributes"): ElementTreeValidationIssue[] {
  const issues: ElementTreeValidationIssue[] = [];
  for (const [name, value] of Object.entries(attributes)) {
    const lower = name.toLowerCase();
    if (lower.startsWith("on") || !SAFE_ATTRIBUTE.test(lower)) {
      issues.push(issue(path, `Unsafe attribute name: ${name}`));
    }
    if ((lower === "href" || lower === "src") && isUnsafeUrl(value)) {
      issues.push(issue(path, `Unsafe URL in attribute: ${name}`));
    }
  }
  return issues;
}

export function validateElementTree(root: ElementNode, options: { published?: boolean; maxDepth?: number; maxChildren?: number } = {}): ElementTreeValidationIssue[] {
  const issues: ElementTreeValidationIssue[] = [];
  const ids = new Set<string>();
  const maxDepth = options.maxDepth ?? 8;
  const maxChildren = options.maxChildren ?? 80;

  function walk(node: ElementNode, parent: ElementNode | null, depth: number, path: string): void {
    const registry = elementRegistry[node.type];
    if (!registry) issues.push(issue(path, `Unknown element type: ${node.type}`, node.elementId));
    if (!SAFE_ELEMENT_ID.test(node.elementId)) issues.push(issue(path, `Unsafe element ID: ${node.elementId}`, node.elementId));
    if (ids.has(node.elementId)) issues.push(issue(path, `Duplicate element ID: ${node.elementId}`, node.elementId));
    ids.add(node.elementId);
    if (depth > maxDepth) issues.push(issue(path, `Element nesting exceeds maximum depth ${maxDepth}.`, node.elementId));
    if (node.children.length > maxChildren) issues.push(issue(path, `Element has more than ${maxChildren} children.`, node.elementId));
    if (parent && node.parentId !== parent.elementId) issues.push(issue(path, `Parent ID mismatch for ${node.elementId}.`, node.elementId));
    if (!parent && node.parentId !== null) issues.push(issue(path, "Page root must not have a parent.", node.elementId));
    if (parent && !canContain(parent.type, node.type)) {
      issues.push(issue(path, `${parent.type} cannot contain ${node.type}.`, node.elementId));
    }
    if (registry && !registry.canHaveChildren && node.children.length > 0) {
      issues.push(issue(path, `${node.type} cannot have children.`, node.elementId));
    }
    if (registry) {
      for (const field of registry.requiredFields) {
        const value = node.content[field];
        if (value === undefined || value === null || value === "") {
          issues.push(issue(`${path}.content.${field}`, `${node.type} requires content field: ${field}`, node.elementId));
        }
      }
    }
    if (typeof node.content.href === "string" && isUnsafeUrl(node.content.href)) {
      issues.push(issue(`${path}.content.href`, "Unsafe href value.", node.elementId));
    }
    if (typeof node.content.src === "string" && isUnsafeUrl(node.content.src)) {
      issues.push(issue(`${path}.content.src`, "Unsafe src value.", node.elementId));
    }
    issues.push(...validateClassList([...node.classes.system, ...node.classes.custom], `${path}.classes`).map((item) => ({ ...item, elementId: node.elementId })));
    issues.push(...validateAttributes(node.attributes, `${path}.attributes`).map((item) => ({ ...item, elementId: node.elementId })));
    if (options.published && registry && (!registry.safeForPublish || registry.builderOnly)) {
      issues.push(issue(path, `${node.type} is not safe for published output.`, node.elementId));
    }
    node.children.forEach((child, index) => walk(child, node, depth + 1, `${path}.children[${index}]`));
  }

  walk(root, null, 0, "root");
  return issues;
}
