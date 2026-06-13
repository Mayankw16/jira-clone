import { redirect } from "next/navigation";

import { getUser } from "@/features/auth/queries";
import { WorkspaceSettingsClient } from "./client";

const WorkspaceSettings = async () => {
  const user = await getUser();
  if (!user) redirect("/sign-in");

  return <WorkspaceSettingsClient />;
};

export default WorkspaceSettings;
