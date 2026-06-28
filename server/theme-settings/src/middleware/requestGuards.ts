import { RequestHandler } from "express";
import { ApiError } from "../utils/errors";

export const requireJsonContent: RequestHandler = (req, _res, next) => {
  if (!req.is("application/json")) {
    next(new ApiError(415, "Write requests must use Content-Type: application/json."));
    return;
  }
  next();
};
