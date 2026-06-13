"use client";

import { z } from "zod";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
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
import { useConfirm } from "@/hooks/use-confirm";
import { DottedSeparator } from "@/components/dotted-seperator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

import { updateProjectSchema } from "../schemas";
import { useUpdateProject } from "../api/use-update-project";
import { useDeleteProject } from "../api/use-delete-project";
import { Project } from "../api/use-get-project";

interface updateProjectFormProps {
  onCancel?: () => void;
  project: Project;
}

export const UpdateProjectForm = ({
  onCancel,
  project,
}: updateProjectFormProps) => {
  const router = useRouter();
  const { mutate: updateProject, isPending: isUpdatingProject } =
    useUpdateProject();
  const { mutate: deleteProject, isPending: isDeletingProject } =
    useDeleteProject();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Project",
    "This action cannot be undone.",
    "destructive",
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...project,
      image: project.imageURL ?? "",
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

    deleteProject(
      { param: { projectId: project.$id } },
      { onSuccess: () => redirect(`/workspaces/${project.workspaceId}`) },
    );
  };

  const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
    updateProject(
      { form: values, param: { projectId: project.$id } },
      {
        onSuccess: ({ data }) => {
          //   router.push(`/workspaces/${data?.$id}`);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <Card className="w-xs sm:w-md md:w-xl lg:w-3xl border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4">
          <Button
            size="sm"
            variant="secondary"
            onClick={
              onCancel
                ? onCancel
                : () =>
                    router.push(
                      `/workspaces/${project.workspaceId}/projects/${project.$id}`,
                    )
            }
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">{project.name}</CardTitle>
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
                      Project Name
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
                        disabled={isUpdatingProject}
                      />
                      {field.value ? (
                        <Button
                          type="button"
                          disabled={isUpdatingProject}
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
                          disabled={isUpdatingProject}
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
                disabled={isUpdatingProject}
                className={cn(!onCancel && "invisible")}
              >
                Cancel
              </Button>
              <Button type="submit" size="lg" disabled={isUpdatingProject}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="font-bold">Danger Zone</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Deleting a project is irreversible and will remove all associated
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
            disabled={isUpdatingProject || isDeletingProject}
            onClick={handleDelete}
          >
            Delete Project
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
