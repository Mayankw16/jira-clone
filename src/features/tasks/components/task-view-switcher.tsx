"use client";

import { useQueryState } from "nuqs";
import { useCallback } from "react";
import { Loader, PlusIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { DottedSeparator } from "@/components/dotted-seperator";
import { Button } from "@/components/ui/button";

import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useBulkUpdateTasks } from "../api/use-bulk-update-task";
import { useTaskFilters } from "../hooks/use-task-filters";
import { useGetTasks } from "../api/use-get-tasks";
import { DataFilters } from "./data-filters";
import { DataTable } from "./data-table";
import { DataKanban } from "./data-kanban";
import { TaskStatus } from "../types";
import { columns } from "./columns";
import { DataCalendar } from "./data-calendar";

export type UpdateTasksPayload = {
  $id: string;
  status: TaskStatus;
  position: number;
}[];

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}

export const TaskViewSwitcher = ({
  hideProjectFilter,
}: TaskViewSwitcherProps) => {
  const workspaceId = useWorkspaceId();
  const paramProjectId = useProjectId();

  const { open } = useCreateTaskModal();
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });
  const [{ status, assigneeId, projectId, dueDate }] = useTaskFilters();

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    projectId: paramProjectId || projectId,
    assigneeId,
    status,
    dueDate,
  });

  const { mutate: bulkUpdate } = useBulkUpdateTasks();

  const onKanbanChange = useCallback(
    (tasks: UpdateTasksPayload) => bulkUpdate({ json: { tasks } }),
    [bulkUpdate],
  );

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="w-full border rounded-lg"
    >
      <div className="flex flex-col p-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-y-2">
          <TabsList className="w-full lg:w-auto bg-transparent gap-x-2">
            <TabsTrigger
              className="h-8 w-full lg:w-auto bg-neutral-100 data-[state=active]:bg-neutral-200 data-[state=active]:text-black data-[state=active]:shadow-none"
              value="table"
            >
              Table
            </TabsTrigger>
            <TabsTrigger
              className="h-8 w-full lg:w-auto bg-neutral-100 data-[state=active]:bg-neutral-200 data-[state=active]:text-black data-[state=active]:shadow-none"
              value="kanban"
            >
              Kanban
            </TabsTrigger>
            <TabsTrigger
              className="h-8 w-full lg:w-auto bg-neutral-100 data-[state=active]:bg-neutral-200 data-[state=active]:text-black data-[state=active]:shadow-none"
              value="calendar"
            >
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button onClick={open} size="sm" className="w-full lg:w-auto">
            <PlusIcon className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters hideProjectFilters={hideProjectFilter} />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-50 flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.rows ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban data={tasks?.rows ?? []} onChange={onKanbanChange} />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
              <DataCalendar data={tasks?.rows ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
