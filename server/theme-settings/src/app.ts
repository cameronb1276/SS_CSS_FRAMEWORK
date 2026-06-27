import cors from "cors";
import express, { ErrorRequestHandler } from "express";
import { apiRouter } from "./routes/api";
import { ApiError } from "./utils/errors";

export function createApp() {
  const app = express();
  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "http://localhost:3000,http://localhost:3004,http://127.0.0.1:3000,http://127.0.0.1:3004")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new ApiError(403, "Origin is not allowed by CORS policy."));
    }
  }));

  app.use(express.json({ limit: "256kb" }));
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

  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof SyntaxError && "body" in err) {
      res.status(400).json({ error: { message: "Malformed JSON request body." } });
      return;
    }

    if (err instanceof ApiError) {
      res.status(err.status).json({ error: { message: err.message, details: err.details } });
      return;
    }

    console.error(err);
    res.status(500).json({ error: { message: "Internal server error." } });
  };

  app.use(errorHandler);

  return app;
}
