export type PageStatus = "draft" | "published";
export type ValidationStatus = "valid" | "warning" | "invalid";

export type SectionType =
  | "hero"
  | "services"
  | "about"
  | "pricing"
  | "testimonials"
  | "faq"
  | "gallery"
  | "contact"
  | "cta"
  | "footer"
  | "custom";

export type BlockType =
  | "heading"
  | "text"
  | "button"
  | "image"
  | "container"
  | "grid"
  | "stack"
  | "cluster"
  | "split"
  | "group"
  | "card"
  | "list"
  | "form-placeholder"
  | "map-placeholder"
  | "business-hours"
  | "testimonial"
  | "custom-html";

export type SiteContentIndex = {
  schemaVersion: 1;
  siteId: string;
  defaultPageId: string;
  pageOrder: string[];
  publishedStatus: PageStatus;
  createdAt: string;
  updatedAt: string;
};

export type PageSummary = {
  pageId: string;
  title: string;
  slug: string;
  status: PageStatus;
  updatedAt: string;
  order: number;
  showInNavigation: boolean;
};

export type PageDocument = {
  schemaVersion: 1;
  pageId: string;
  title: string;
  slug: string;
  seo: {
    title: string;
    description: string;
  };
  status: PageStatus;
  createdAt: string;
  updatedAt: string;
  navigation: {
    label: string;
    order: number;
    showInNavigation: boolean;
  };
  sectionOrder: string[];
  sections: SectionDocument[];
  metadata: Record<string, string | number | boolean | null>;
};

export type SectionDocument = {
  sectionId: string;
  type: SectionType;
  displayName: string;
  locked: boolean;
  hidden: boolean;
  stylePreset: "plain" | "soft" | "tinted" | "dark" | "bordered";
  layoutPreset: "single" | "split" | "grid" | "centered" | "wide";
  spacingPreset: "compact" | "comfortable" | "spacious";
  background: "default" | "surface" | "soft" | "primary-soft" | "accent-soft" | "dark";
  blockOrder: string[];
  blocks: BlockDocument[];
};

export type BlockDocument = {
  blockId: string;
  type: BlockType;
  label: string;
  content: Record<string, unknown>;
  hidden: boolean;
  locked: boolean;
  validation: {
    status: ValidationStatus;
    messages: string[];
  };
  style: Record<string, string | number | boolean | null>;
  blockOrder?: string[];
  blocks?: BlockDocument[];
  link?: {
    href: string;
    label: string;
    target: "_self" | "_blank";
  };
  media?: {
    src: string;
    alt: string;
  };
};
