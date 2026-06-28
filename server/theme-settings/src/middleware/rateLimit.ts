import { RequestHandler } from "express";
import { writeRateLimitMax, writeRateLimitWindowMs } from "../config";
import { ApiError } from "../utils/errors";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function resetWriteRateLimitBuckets(): void {
  buckets.clear();
}

function keyFor(req: Parameters<RequestHandler>[0]): string {
  const actor = typeof req.res?.locals?.actor === "string" ? req.res.locals.actor : "anonymous";
  return `${actor}:${req.ip}:${req.method}:${req.path}`;
}

export const writeRateLimit: RequestHandler = (req, _res, next) => {
  const now = Date.now();
  const windowMs = writeRateLimitWindowMs();
  const max = writeRateLimitMax();
  const key = keyFor(req);
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    next();
    return;
  }

  bucket.count += 1;
  if (bucket.count > max) {
    next(new ApiError(429, "Too many write requests. Try again later."));
    return;
  }

  next();
};
