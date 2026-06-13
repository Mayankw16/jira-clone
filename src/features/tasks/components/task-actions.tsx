import { useRouter } from "next/navigation";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useConfirm } from "@/hooks/use-confirm";

import { useUpdateTaskModal } from "../hooks/use-update-task-modal";
import { useDeleteTask } from "../api/use-delete-task";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskActionsProps {
  taskId: string;
  projectId: string;
  children: React.ReactNode;
}

export const TaskActions = ({
  taskId,
  projectId,
  children,
}: TaskActionsProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { open } = useUpdateTaskModal();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete task",
    "This action cannot be undone.",
    "destructive",
  );

  const { mutate, isPending } = useDeleteTask();

  const onDelete = async () => {
    const confirmed = await confirm();
    if (!confirmed) return;

    mutate({ param: { taskId } });
  };

  const onOpenTask = () =>
    router.push(`/workspaces/${workspaceId}/tasks/${taskId}`);

  const onOpenProject = () =>
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onOpenTask} className="font-medium p-2.5">
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onOpenProject}
            className="font-medium p-2.5"
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => open(taskId)}
            className="font-medium p-2.5"
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending}
            className="text-amber-700 focus:text-amber-700 font-medium p-2.5"
          >
            <TrashIcon className="size-4 mr-2 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
