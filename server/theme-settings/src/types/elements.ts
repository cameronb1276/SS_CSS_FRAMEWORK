export type ElementVisibility = {
  hidden: boolean;
  hiddenOn?: Array<"desktop" | "tablet" | "mobile">;
};

export type ElementClassList = {
  system: string[];
  custom: string[];
};

export type ElementDesign = {
  spacing?: "compact" | "comfortable" | "spacious";
  width?: "narrow" | "standard" | "wide" | "full";
  align?: "start" | "center" | "end";
  background?: "default" | "surface" | "soft" | "primary-soft" | "accent-soft" | "dark";
  textColor?: "default" | "muted" | "inverted" | "primary" | "accent";
  variant?: string;
  radius?: "sharp" | "soft" | "rounded" | "pill-heavy";
  shadow?: "flat" | "soft" | "elevated" | "strong";
};

export type ElementNode = {
  elementId: string;
  label: string;
  type: ElementType;
  parentId: string | null;
  children: ElementNode[];
  content: Record<string, unknown>;
  design: ElementDesign;
  classes: ElementClassList;
  attributes: Record<string, string>;
  visibility: ElementVisibility;
  locked: boolean;
  trashed?: boolean;
  metadata: {
    source: "page" | "section" | "block" | "virtual";
    createdAt: string;
    updatedAt: string;
    notes?: string;
  };
};

export type ElementType =
  | "page-root"
  | "section"
  | "container"
  | "grid"
  | "stack"
  | "cluster"
  | "split"
  | "card"
  | "group"
  | "heading"
  | "paragraph"
  | "rich-text"
  | "list"
  | "quote"
  | "badge"
  | "button"
  | "link"
  | "button-group"
  | "nav"
  | "nav-link"
  | "image"
  | "video-embed"
  | "map-embed"
  | "gallery"
  | "service-card"
  | "testimonial-card"
  | "pricing-card"
  | "business-hours"
  | "location-card"
  | "contact-card"
  | "announcement-bar"
  | "emergency-banner"
  | "coupon-card"
  | "form"
  | "input"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "submit-button"
  | "custom-html"
  | "custom-code-placeholder";

export type ElementRegistryEntry = {
  type: ElementType;
  label: string;
  category: "structural" | "content" | "action" | "media" | "business" | "form" | "advanced";
  canHaveChildren: boolean;
  allowedChildren: ElementType[] | "*";
  allowedParents: ElementType[] | "*";
  defaultContent: Record<string, unknown>;
  defaultDesign: ElementDesign;
  defaultClasses: string[];
  editableFields: string[];
  requiredFields: string[];
  renderCategory: "page" | "section" | "layout" | "text" | "action" | "media" | "business" | "form" | "advanced";
  safeForPublish: boolean;
  builderOnly: boolean;
};

export type ElementTreeValidationIssue = {
  elementId?: string;
  path: string;
  message: string;
};
