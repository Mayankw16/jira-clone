"use client";

import { Loader } from "lucide-react";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetTask } from "@/features/tasks/api/use-get-task";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { Card, CardContent } from "@/components/ui/card";

import { UpdateTaskForm } from "./update-task-form";

interface EditTaskFormWrapperProps {
  onCancel: () => void;
  id: string;
}

export const UpdateTaskFormWrapper = ({
  onCancel,
  id,
}: EditTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data: task, isLoading: isLoadingTask } = useGetTask({
    taskId: id,
  });

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const projectOptions = projects?.rows.map((project) => ({
    $id: project.$id,
    name: project.name,
    imageURL: project.imageURL,
  }));

  const memberOptions = members?.rows.map((project) => ({
    $id: project.$id,
    name: project.name,
  }));

  const isLoading = isLoadingTask || isLoadingProjects || isLoadingMembers;

  if (isLoading) {
    return (
      <Card className="w-full h-178 border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // TDOD: improve this
  if (!task) {
    return null;
  }

  const initialValues = {
    $id: task.$id,
    name: task.name,
    assigneeId: task.assigneeId,
    projectId: task.projectId,
    status: task.status,
    dueDate: task.dueDate,
  };

  return (
    <UpdateTaskForm
      onCancel={onCancel}
      initialValues={initialValues}
      projectOptions={projectOptions ?? []}
      memberOptions={memberOptions ?? []}
    />
  );
};
