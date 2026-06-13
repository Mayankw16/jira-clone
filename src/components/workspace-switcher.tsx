"use client";

import { RiAddCircleFill } from "react-icons/ri";
import { useRouter } from "next/navigation";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { Skeleton } from "./ui/skeleton";

export const WorkspaceSwitcher = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { data: workspaces, isLoading } = useGetWorkspaces();
  const { open } = useCreateWorkspaceModal();

  const onSelect = (id: string) => router.push(`/workspaces/${id}`);

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between px-3">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      {isLoading ? (
        <Skeleton className="bg-neutral-200 w-56 h-12" />
      ) : (
        <Select onValueChange={onSelect} value={workspaceId}>
          <SelectTrigger className="w-full bg-neutral-200 font-medium">
            <SelectValue placeholder="No workspace selected" />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={5}>
            <SelectGroup>
              <SelectLabel>Workspaces ({workspaces?.rows.length})</SelectLabel>
              {workspaces?.rows.map((workspace) => (
                <SelectItem key={workspace.$id} value={workspace.$id}>
                  <div className="flex items-center justify-start gap-3 font-medium">
                    <WorkspaceAvatar
                      name={workspace.name}
                      image={workspace.imageURL}
                    />
                    <span className="truncate">{workspace.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
