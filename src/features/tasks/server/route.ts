import { Hono } from "hono";

import { getTasks } from "./controllers/get-tasks";
import { createTask } from "./controllers/create-task";
import { getTask } from "./controllers/get-task";
import { deleteTask } from "./controllers/delete-task";
import { updateTask } from "./controllers/update-task";
import { bulkUpdateTask } from "./controllers/bulk-update-task";

const app = new Hono()
  .get("/", ...getTasks)
  .post("/", ...createTask)
  .patch("/bulk-update", ...bulkUpdateTask)
  .get("/:taskId", ...getTask)
  .delete("/:taskId", ...deleteTask)
  .patch("/:taskId", ...updateTask);

export default app;
