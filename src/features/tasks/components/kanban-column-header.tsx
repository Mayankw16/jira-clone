import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { snakeCaseToTitleCase } from "@/lib/utils";

import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { TaskStatus } from "../types";

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: <CircleDashedIcon className="size-4.5 text-red-700" />,
  [TaskStatus.TODO]: <CircleIcon className="size-4.5 text-blue-600" />,
  [TaskStatus.IN_PROGRESS]: (
    <CircleDotDashedIcon className="size-4.5 text-yellow-600" />
  ),
  [TaskStatus.IN_REVIEW]: (
    <CircleDotIcon className="size-4.5 text-purple-600" />
  ),
  [TaskStatus.DONE]: <CircleCheckIcon className="size-4.5 text-green-700" />,
};

export const KanbanColumnHeader = ({
  board,
  taskCount,
}: KanbanColumnHeaderProps) => {
  const { open } = useCreateTaskModal();
  const icon = statusIconMap[board];

  return (
    <div className="px-2 py-1.5 flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
        <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium">
          {taskCount}
        </div>
      </div>
      <Button onClick={open} variant="ghost" className="size-5">
        <PlusIcon className="size-4 text-neutral-500" />
      </Button>
    </div>
  );
};
