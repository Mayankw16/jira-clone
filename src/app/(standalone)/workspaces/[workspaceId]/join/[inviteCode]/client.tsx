import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { useInviteCode } from "@/features/workspaces/hooks/use-invite-code";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "@/components/loader";
import { Error } from "@/components/error";

export const JoinWorkspaceClient = () => {
  const workspaceId = useWorkspaceId();
  const inviteCode = useInviteCode();

  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetWorkspaceInfo({ workspaceId });

  if (isLoadingWorkspace) return <Loader />;

  if (!workspace)
    return (
      <Error message="The invite code is invalid, or the workspace no longer exists." />
    );

  return <JoinWorkspaceForm workspace={workspace} inviteCode={inviteCode} />;
};
