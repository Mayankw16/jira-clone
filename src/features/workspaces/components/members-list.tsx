"use client";

import Link from "next/link";
import { Fragment } from "react";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";

import { MemberRole } from "@/features/members/types";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useUpdateRole } from "@/features/members/api/use-update-role";

import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { Separator } from "@/components/ui/separator";
import { DottedSeparator } from "@/components/dotted-seperator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export const MembersList = ({ workspaceId }: { workspaceId: string }) => {
  const router = useRouter();
  const [ConfirmDialog, confirm] = useConfirm(
    "Remove member",
    "This member will be removed from the workspace",
    "destructive",
  );

  const { data, isLoading } = useGetMembers({ workspaceId });

  const { mutate: deleteMember, isPending: isDeletingMember } =
    useDeleteMember();
  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateRole();

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateRole({ json: { role, memberId, workspaceId } });
  };

  const handleDeleteMember = async (memberId: string) => {
    const confirmed = await confirm();
    if (!confirmed) return;

    deleteMember(
      { json: { memberId, workspaceId } },
      { onSuccess: ({}) => router.refresh() },
    );
  };

  return (
    <Card className="border-none shadow-none">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 space-y-0">
        <Button asChild variant="secondary" size="sm">
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon className="size-4" />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">Members list</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent>
        {isLoading
          ? MembersList.Loading
          : data?.rows?.map((member, index) => (
              <Fragment key={member.$id}>
                <div className="flex items-center gap-2">
                  <MemberAvatar
                    className="size-10"
                    fallbackClassName="text-lg"
                    name={member.name}
                  />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">
                      {member.name}
                      {member.role === MemberRole.ADMIN && (
                        <Badge className="ml-2" variant="destructive">
                          Admin
                        </Badge>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="ml-auto"
                        variant="secondary"
                        size="icon"
                      >
                        <MoreVerticalIcon className="size-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="bottom"
                      align="end"
                      className="w-60"
                    >
                      {member.role !== MemberRole.ADMIN && (
                        <DropdownMenuItem
                          className="font-medium"
                          onClick={() =>
                            handleUpdateMember(member.$id, MemberRole.ADMIN)
                          }
                          disabled={isUpdatingRole}
                        >
                          Set as Administrator
                        </DropdownMenuItem>
                      )}
                      {member.role !== MemberRole.MEMBER && (
                        <DropdownMenuItem
                          className="font-medium"
                          onClick={() =>
                            handleUpdateMember(member.$id, MemberRole.MEMBER)
                          }
                          disabled={isUpdatingRole}
                        >
                          Set as Member
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="font-medium text-amber-700"
                        onClick={() => handleDeleteMember(member.$id)}
                        disabled={isDeletingMember}
                      >
                        Remove {member.name}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {index < data.total - 1 && <Separator className="my-2.5" />}
              </Fragment>
            ))}
      </CardContent>
    </Card>
  );
};

MembersList.Loading = (
  <>
    {Array.from({ length: 5 }).map((_, i) => (
      <Fragment key={i}>
        <div className="flex items-center justify-between">
          <div className="flex gap-x-3 items-center">
            <Skeleton className="size-9 rounded-full bg-neutral-300" />
            <div className="flex flex-col gap-y-1">
              <Skeleton className="w-40 h-5 bg-neutral-300" />
              <Skeleton className="w-44 h-4 bg-neutral-300" />
            </div>
          </div>
          <Skeleton className="size-8.5 rounded-md bg-neutral-300" />
        </div>
        {i < 4 && <Separator className="my-2.5" />}
      </Fragment>
    ))}
  </>
);
