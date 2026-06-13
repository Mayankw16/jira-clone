import { redirect } from "next/navigation";

import { getUser } from "@/features/auth/queries";
import { ProjectClient } from "./client";

interface ProjectPageProps {
  params: Promise<{ workspaceId: string; projectId: string }>;
}

const ProjectPage = async ({ params }: ProjectPageProps) => {
  const user = getUser();
  if (!user) redirect("/sign-in");

  return <ProjectClient />;
};

export default ProjectPage;
