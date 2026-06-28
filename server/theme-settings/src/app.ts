import cors from "cors";
import express, { ErrorRequestHandler } from "express";
import { apiRouter } from "./routes/api";
import { ApiError } from "./utils/errors";
import { allowedOrigins, jsonBodyLimit } from "./config";
import { auditEventFromRequest } from "./services/auditLog";

export function createApp() {
  const app = express();
  const origins = allowedOrigins();

  app.use(cors({
    origin(origin, callback) {
      if (!origin || origins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new ApiError(403, "Origin is not allowed by CORS policy."));
    }
  }));

  app.use(express.json({ limit: jsonBodyLimit() }));
  app.use((req, _res, next) => {
    if (process.env.REQUEST_LOGGING !== "false") {
      console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
    }
    next();
  });

  app.use("/api", apiRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: { message: "Route not found." } });
  });

  const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
    if (err instanceof SyntaxError && "body" in err) {
      void auditEventFromRequest(req, { action: "validation.failure", result: "failure", status: 400, reason: "Malformed JSON request body." });
      res.status(400).json({ error: { message: "Malformed JSON request body." } });
      return;
    }

    if (err instanceof ApiError) {
      const action = err.status === 429 ? "rate-limit.failure" : err.status >= 400 && err.status < 500 ? "validation.failure" : "request.failure";
      void auditEventFromRequest(req, { action, result: "failure", status: err.status, reason: err.message });
      res.status(err.status).json({ error: { message: err.message, details: err.details } });
      return;
    }

    console.error(err);
    res.status(500).json({ error: { message: "Internal server error." } });
  };

  app.use(errorHandler);

  return app;
}
