"use client";

import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { UpdateWorkspaceForm } from "@/features/workspaces/components/update-workspace-form";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "@/components/loader";
import { Error } from "@/components/error";

export const WorkspaceSettingsClient = () => {
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading: isLoadingWorkspace } = useGetWorkspace({
    workspaceId,
  });

  if (isLoadingWorkspace) return <Loader />;

  if (!workspace)
    return (
      <Error message="This workspace either does not exist or you are not authorized to access it." />
    );

  return <UpdateWorkspaceForm workspace={workspace} />;
};
