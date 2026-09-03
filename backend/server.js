import "dotenv/config";
import express from "express";
import cors from "cors";

import { clerkMiddleware } from "@clerk/express";
import prisma from "./config/db.js";

import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

import workspaceRouter from "./routes/workspace.route.js";
import { protect } from "./middleware/auth.middleware.js";
import projectRouter from "./routes/project.route.js";
import taskRouter from "./routes/task.route.js";
import commentRouter from "./routes/comment.route.js";

const app = express();

// ==========================================
// CORS
// ==========================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
]
  .filter(Boolean)
  .map((origin) => origin.replace(/\/$/, ""));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without Origin
      // e.g. Postman, curl, server-to-server
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/$/, "");

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      console.error(`CORS blocked origin: ${origin}`);

      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },

    credentials: true,
  }),
);

// ==========================================
// Middleware
// ==========================================

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(clerkMiddleware());

// ==========================================
// Health
// ==========================================

app.get("/", (req, res) => {
  res.send("Server Is Live");
});

// ==========================================
// Inngest
// ==========================================

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  }),
);

// ==========================================
// Test DB
// ==========================================

app.get("/test-db", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// ==========================================
// API Routes
// ==========================================

app.use("/api/workspaces", protect, workspaceRouter);

app.use("/api/projects", protect, projectRouter);

app.use("/api/tasks", protect, taskRouter);

app.use("/api/comments", protect, commentRouter);

// ==========================================
// Local Server
// ==========================================

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
  });
}

export default app;
