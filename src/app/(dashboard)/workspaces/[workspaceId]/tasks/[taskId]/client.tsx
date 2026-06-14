"use client";

import { DottedSeparator } from "@/components/dotted-seperator";
import { Error } from "@/components/error";
import { Loader } from "@/components/loader";
import { useGetTask } from "@/features/tasks/api/use-get-task";
import { TaskBreadcrumbs } from "@/features/tasks/components/task-breadcrumbs";
import { TaskDescription } from "@/features/tasks/components/task-description";
import { TaskOverview } from "@/features/tasks/components/task-overview";
import { useTaskId } from "@/features/tasks/hooks/use-task-id";

export const TaskClient = () => {
  const taskId = useTaskId();
  const { data: task, isLoading: isLoadingTask } = useGetTask({ taskId });

  if (isLoadingTask) return <Loader />;

  if (!task)
    return (
      <Error message="This task either does not exist or you are not authorized to access it." />
    );

  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs task={task} />
      <DottedSeparator className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={task} />
        <TaskDescription task={task} />
      </div>
    </div>
  );
};
