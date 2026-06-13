"use client";

import { z } from "zod";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";

import { useCreateWorkspace } from "../api/use-create-workspace";
import { createWorkspaceSchema } from "../schemas";

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
}

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useCreateWorkspace();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
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

  const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
    mutate(
      { form: values },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${data?.$id}`);
        },
      },
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex">
        <CardTitle className="text-xl font-bold">
          Create a new workspace
        </CardTitle>
      </CardHeader>
      <div className="px-6">
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
              Create Workspace
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
