import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { useInviteCode } from "@/features/workspaces/hooks/use-invite-code";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export const JoinWorkspaceClient = () => {
  const workspaceId = useWorkspaceId();
  const inviteCode = useInviteCode();

  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetWorkspaceInfo({ workspaceId });

  // TDOD: improve this
  if (isLoadingWorkspace) return <h1>Loading...</h1>;
  if (!workspace) return <h1>Workspace not found!</h1>;

  return <JoinWorkspaceForm workspace={workspace} inviteCode={inviteCode} />;
};
