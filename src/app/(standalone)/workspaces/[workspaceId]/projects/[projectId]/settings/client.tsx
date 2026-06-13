"use client";

import { useGetProject } from "@/features/projects/api/use-get-project";
import { UpdateProjectForm } from "@/features/projects/components/update-project-form";
import { useProjectId } from "@/features/projects/hooks/use-project-id";

export const ProjectSettingsClient = () => {
  const projectId = useProjectId();

  const { data: project, isLoading: isLoadingProject } = useGetProject({
    projectId,
  });

  // TODO: improve this
  if (isLoadingProject) return <h1>Laoding...</h1>;
  if (!project) return <h1>No project found</h1>;

  return <UpdateProjectForm project={project} />;
};
