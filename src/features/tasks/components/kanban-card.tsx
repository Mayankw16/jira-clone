import { MoreHorizontalIcon } from "lucide-react";

import { DottedSeparator } from "@/components/dotted-seperator";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

import { TaskActions } from "./task-actions";
import { TaskDate } from "./task-date";
import { PopulatedTask } from "../api/use-get-tasks";

interface KanbanCardProps {
  task: PopulatedTask;
}

export const KanbanCard = ({ task }: KanbanCardProps) => (
  <div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
    <div className="flex items-start justify-between gap-x-2 text-[10px">
      <p className="text-sm line-clamp-2">{task.name}</p>
      <TaskActions taskId={task.$id} projectId={task.projectId}>
        <MoreHorizontalIcon className="size-4.5 stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
      </TaskActions>
    </div>
    <DottedSeparator />
    <div className="flex items-center gap-x-1.5">
      <MemberAvatar name={task.assignee.name} fallbackClassName="text-[10px]" />
      <div className="size-1 rounded-full bg-neutral-300" />
      <TaskDate value={task.dueDate} className="text-xs" />
    </div>
    <div className="flex items-center gap-x-1.5">
      <ProjectAvatar
        name={task.project.name}
        image={task.project.imageURL}
        fallbackClassName="text-[10px]"
      />
      <span className="text-xs font-medium">{task.project.name}</span>
    </div>
  </div>
);
