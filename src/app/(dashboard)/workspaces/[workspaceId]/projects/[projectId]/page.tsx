import { redirect } from "next/navigation";

import { getUser } from "@/features/auth/queries";
import { ProjectClient } from "./client";

const ProjectPage = async () => {
  const user = getUser();
  if (!user) redirect("/sign-in");

  return <ProjectClient />;
};

export default ProjectPage;
