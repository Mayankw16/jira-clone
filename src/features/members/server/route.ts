import { Hono } from "hono";
import { getMembers } from "./controllers/get-members";
import { deleteMember } from "./controllers/delete-member";
import { updateRole } from "./controllers/update-role";

const app = new Hono()
  .get("/", ...getMembers)
  .delete("/", ...deleteMember)
  .patch("/", ...updateRole);

export default app;
