import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { subjectRoutes } from "./routes/subjects";
import { assignmentRoutes } from "./routes/assignments";
import { userRoutes } from "./routes/users";

const PORT = process.env.PORT || 3001;

const app = new Elysia()
  .use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
    })
  )
  .get("/", () => ({
    name: "Tesuto API",
    version: "1.0.0",
    status: "running",
  }))
  .get("/health", () => ({ status: "ok", timestamp: new Date().toISOString() }))
  .use(userRoutes)
  .use(subjectRoutes)
  .use(assignmentRoutes)
  .listen(PORT);

console.log(
  `🦊 Tesuto API is running at ${app.server?.hostname}:${app.server?.port}`
);
