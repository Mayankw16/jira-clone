"use client";

import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-seperator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";

import { updateWorkspaceSchema } from "../schemas";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { useResetInviteCode } from "../api/use-reset-invite-code";
import { Workspace } from "../api/use-get-workspace";

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
  workspace: Workspace;
}

export const UpdateWorkspaceForm = ({
  onCancel,
  workspace,
}: CreateWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();
  const { mutate: resetInviteCode, isPending: isResettingInviteCode } =
    useResetInviteCode();
  const [inviteLink, setInviteLink] = useState<string>("");

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workpace",
    "This action cannot be undone.",
    "destructive",
  );

  const [ResetInviteCodeDialog, confirmReset] = useConfirm(
    "Reset invite link",
    "This will invalidate the current invite link",
    "destructive",
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...workspace,
      image: workspace.imageURL ?? "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // 2 MB limit
    const maxSize = 2 * 1024 * 1024;

    if (file && file.size > maxSize)
      toast.error("File size must be less than 2MB!");
    else if (file) form.setValue("image", file);
  };

  const handleDelete = async () => {
    const confirmed = await confirmDelete();
    if (!confirmed) return;

    deleteWorkspace(
      { param: { workspaceId: workspace.$id } },
      { onSuccess: () => redirect("/") },
    );
  };

  const handleResetInviteCode = async () => {
    const confirmed = await confirmReset();

    if (!confirmed) return;

    resetInviteCode(
      { param: { workspaceId: workspace.$id } },
      { onSuccess: () => router.refresh() },
    );
  };

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    mutate(
      { form: values, param: { workspaceId: workspace.$id } },
      { onSuccess: ({ data }) => router.push(`/workspaces/${data?.$id}`) },
    );
  };

  useEffect(() => {
    const fullInviteLink = `${window.location.origin}/workspaces/${workspace.$id}/join/${workspace.inviteCode}`;
    setInviteLink(fullInviteLink);
  }, [workspace.inviteCode]);

  const handleCopyInviteLink = () => {
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link copied to clipboard!"));
  };

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <ResetInviteCodeDialog />
      <Card className="w-xs sm:w-md md:w-xl lg:w-3xl border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4">
          <Button
            size="sm"
            variant="secondary"
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${workspace.$id}`)
            }
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">{workspace.name}</CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="workspace-name">
                      Workspace Name
                    </FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      id="workspace-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter workspace name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                name="image"
                control={form.control}
                render={({ field }) => (
                  <div className="flex items-center gap-x-5">
                    {field.value ? (
                      <div className="size-18 relative rounded-md overflow-hidden">
                        <Image
                          alt="workspace-logo"
                          fill
                          className="object-cover"
                          src={
                            field.value instanceof File
                              ? URL.createObjectURL(field.value)
                              : field.value
                          }
                        />
                      </div>
                    ) : (
                      <Avatar className="size-18">
                        <AvatarFallback>
                          <ImageIcon className="size-9 text-neutral-400" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col">
                      <p className="text-sm mb-1">Workspace Icon</p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG, SVG or JPEG, max 2MB
                      </p>
                      <input
                        className="hidden"
                        type="file"
                        accept=".jpg, .png, .jpeg, .svg"
                        ref={inputRef}
                        onChange={handleImageChange}
                        disabled={isPending}
                      />
                      {field.value ? (
                        <Button
                          type="button"
                          disabled={isPending}
                          variant="destructive"
                          size="xs"
                          className="w-fit mt-2"
                          onClick={() => {
                            field.onChange(null);
                            if (inputRef.current) {
                              inputRef.current.value = "";
                            }
                          }}
                        >
                          Remove Image
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          disabled={isPending}
                          variant="tertiary"
                          size="xs"
                          className="w-fit mt-2"
                          onClick={() => inputRef.current?.click()}
                        >
                          Upload Image
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              />
            </FieldGroup>
            <div className="flex items-center justify-between mt-7">
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={onCancel}
                disabled={isPending}
                className={cn(!onCancel && "invisible")}
              >
                Cancel
              </Button>
              <Button type="submit" size="lg" disabled={isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="font-bold">Invite Members</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Use the invite link to add members to your workspace.
          </CardDescription>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent>
          <div className="flex items-center gap-x-2">
            <Input disabled value={inviteLink} />
            <Button
              onClick={handleCopyInviteLink}
              variant="secondary"
              className="size-12"
            >
              <CopyIcon className="size-5" />
            </Button>
          </div>
        </CardContent>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardFooter>
          <Button
            className="w-fit ml-auto"
            size="sm"
            variant="destructive"
            type="button"
            disabled={isPending || isResettingInviteCode}
            onClick={handleResetInviteCode}
          >
            Reset invite link
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="font-bold">Danger Zone</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Deleting a workspace is irreversible and will remove all associated
            data.
          </CardDescription>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardFooter>
          <Button
            className="w-fit ml-auto"
            size="sm"
            variant="destructive"
            type="button"
            disabled={isPending || isDeletingWorkspace}
            onClick={handleDelete}
          >
            Delete Workspace
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
