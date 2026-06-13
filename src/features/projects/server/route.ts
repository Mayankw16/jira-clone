import { Hono } from "hono";
import { getProjects } from "./controllers/get-projects";
import { createProject } from "./controllers/create-project";
import { deleteProject } from "./controllers/delete-project";
import { updateProject } from "./controllers/update-project";
import { getProject } from "./controllers/get-project";
import { getAnalytics } from "./controllers/get-analytics";

const app = new Hono()
  .get("/", ...getProjects)
  .post("/", ...createProject)
  .get("/:projectId", ...getProject)
  .patch("/:projectId", ...updateProject)
  .delete("/:projectId", ...deleteProject)
  .get("/:projectId/analytics", ...getAnalytics);

export default app;
