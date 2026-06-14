"use client";

import { PencilIcon } from "lucide-react";
import Link from "next/link";

import { useGetProject } from "@/features/projects/api/use-get-project";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { Button } from "@/components/ui/button";
import { Analytics } from "@/components/analytics";
import { Loader } from "@/components/loader";
import { Error } from "@/components/error";

export const ProjectClient = () => {
  const projectId = useProjectId();
  const { data: project, isLoading: isLoadingProject } = useGetProject({
    projectId,
  });
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetProjectAnalytics({ projectId });

  const isLoading = isLoadingProject || isLoadingAnalytics;

  if (isLoading) return <Loader />;

  if (!project)
    return (
      <Error message="This project either does not exist or you are not authorized to access it." />
    );

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.imageURL}
            className="size-8"
          />
          <p className="font-semibold">{project.name}</p>
        </div>
        <Button variant="secondary" size="sm" asChild>
          <Link
            href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}
          >
            <PencilIcon className="size-4" />
            Edit Project
          </Link>
        </Button>
      </div>
      {analytics ? <Analytics data={analytics} /> : null}
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};
