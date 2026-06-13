import { redirect } from "next/navigation";

import { getUser } from "@/features/auth/queries";

import { ProjectSettingsClient } from "./client";

const ProjectSettingsPage = async () => {
  const user = getUser();
  if (!user) redirect("/sign-in");

  return <ProjectSettingsClient />;
};

export default ProjectSettingsPage;
