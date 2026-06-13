import { PencilIcon } from "lucide-react";

import { MemberAvatar } from "@/features/members/components/member-avatar";
import { DottedSeparator } from "@/components/dotted-seperator";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { PopulatedTask } from "../api/use-get-tasks";
import { useUpdateTaskModal } from "../hooks/use-update-task-modal";
import { OverviewProperty } from "./overview-property";
import { TaskDate } from "./task-date";

interface TaskOverviewProps {
  task: PopulatedTask;
}

export const TaskOverview = ({ task }: TaskOverviewProps) => {
  const { open } = useUpdateTaskModal();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Overview</h2>
          <Button onClick={() => open(task.$id)} size="sm" variant="secondary">
            <PencilIcon className="size-4 mr-2" />
            Edit
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Assignee">
            <MemberAvatar name={task.assignee.name} className="size-6" />
            <p className="text-sm font-medium">{task.assignee.name}</p>
          </OverviewProperty>
          <OverviewProperty label="Due Date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>
          <OverviewProperty label="Status">
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};
