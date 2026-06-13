import { Hono } from "hono";

import { getWorkspaces } from "./controllers/get-workspaces";
import { createWorkspace } from "./controllers/create-workspace";
import { getWorkspace } from "./controllers/get-workspace";
import { updateWorkspace } from "./controllers/update-workspace";
import { deleteWorkspace } from "./controllers/delete-workspace";
import { getWorkspaceInfo } from "./controllers/get-workspace-info";
import { getAnalytics } from "./controllers/get-analytics";
import { resetInviteCode } from "./controllers/reset-invite-code";
import { joinWorkspace } from "./controllers/join-workspace";

const app = new Hono()
  .get("/", ...getWorkspaces)
  .post("/", ...createWorkspace)
  .get("/:workspaceId", ...getWorkspace)
  .patch("/:workspaceId", ...updateWorkspace)
  .delete("/:workspaceId", ...deleteWorkspace)
  .get("/:workspaceId/info", ...getWorkspaceInfo)
  .get("/:workspaceId/analytics", ...getAnalytics)
  .post("/:workspaceId/reset-invite-code", ...resetInviteCode)
  .post("/:workspaceId/join", ...joinWorkspace);

export default app;
