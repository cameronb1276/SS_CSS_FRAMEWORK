import { badRequest } from "../utils/errors";

const SAFE_SITE_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateSiteId(input: unknown): string {
  if (typeof input !== "string") {
    throw badRequest("siteId must be a string.");
  }

  let decoded = input;
  try {
    decoded = decodeURIComponent(input);
  } catch {
    throw badRequest("siteId is not valid URL text.");
  }

  if (decoded !== input || decoded.length < 3 || decoded.length > 64 || !SAFE_SITE_ID.test(decoded)) {
    throw badRequest("siteId must use lowercase letters, numbers, and hyphens only.");
  }

  if (decoded.includes("..") || decoded.includes("/") || decoded.includes("\\") || decoded.includes(" ")) {
    throw badRequest("siteId contains unsafe path characters.");
  }

  return decoded;
}
