"use client";

import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { UpdateWorkspaceForm } from "@/features/workspaces/components/update-workspace-form";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export const WorkspaceSettingsClient = () => {
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading: isLoadingWorkspace } = useGetWorkspace({
    workspaceId,
  });

  // TDOD: improve this
  if (isLoadingWorkspace) return <h1>Loading...</h1>;
  if (!workspace) return <h1>Workspace not found!</h1>;

  return <UpdateWorkspaceForm workspace={workspace} />;
};
