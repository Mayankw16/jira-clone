"use client";

import { useRouter } from "next/navigation";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-seperator";
import { Button } from "@/components/ui/button";

import { useJoinWorkspace } from "../api/use-join-workspace";
import { WorkspaceInfo } from "../api/use-get-workspace-info";

interface JoinWorkspaceFormProps {
  workspace: WorkspaceInfo;
  inviteCode: string;
}

export const JoinWorkspaceForm = ({
  workspace,
  inviteCode,
}: JoinWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useJoinWorkspace();

  const joinWorkspace = () =>
    mutate(
      {
        param: { workspaceId: workspace.$id },
        json: { inviteCode },
      },
      { onSuccess: ({ data }) => router.push(`/workspaces/${data.$id}`) },
    );

  return (
    <Card className="w-[90%] lg:max-w-3xl border-none shadow-non">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Join workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join <strong>{workspace.name}</strong>{" "}
          workspace
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardFooter className="flex flex-col sm:flex-row gap-2 items-center justify-end">
        <Button
          variant="secondary"
          type="button"
          size="lg"
          className="w-full sm:w-fit"
          disabled={isPending}
          onClick={() => router.push("/")}
        >
          Cancel
        </Button>
        <Button
          size="lg"
          className="w-full sm:w-fit"
          type="button"
          onClick={joinWorkspace}
          disabled={isPending}
        >
          Join Workspace
        </Button>
      </CardFooter>
    </Card>
  );
};
