"use client";

import { Loader } from "@/components/loader";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { UpdateProjectForm } from "@/features/projects/components/update-project-form";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { Error } from "@/components/error";

export const ProjectSettingsClient = () => {
  const projectId = useProjectId();

  const { data: project, isLoading: isLoadingProject } = useGetProject({
    projectId,
  });

  if (isLoadingProject) return <Loader />;

  if (!project)
    return (
      <Error message="This project either does not exist or you are not authorized to access it." />
    );

  return <UpdateProjectForm project={project} />;
};
