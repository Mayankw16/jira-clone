"use client";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-seperator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { DatePicker } from "@/components/date-picker";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useUpdateTask } from "@/features/tasks/api/use-update-task";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

import { upsertTaskFormSchema } from "../schemas";
import { TaskStatus } from "../types";

const statusOptions = [
  { value: TaskStatus.BACKLOG, label: "Backlog" },
  { value: TaskStatus.TODO, label: "Todo" },
  { value: TaskStatus.IN_PROGRESS, label: "In Progress" },
  { value: TaskStatus.IN_REVIEW, label: "In Review" },
  { value: TaskStatus.DONE, label: "Done" },
];

interface UpdateTaskFormProps {
  onCancel?: () => void;
  projectOptions: { $id: string; name: string; imageURL: string }[];
  memberOptions: { $id: string; name: string }[];
  initialValues: {
    $id: string;
    name: string;
    assigneeId: string;
    projectId: string;
    status: TaskStatus;
    dueDate: string;
  };
}

export const UpdateTaskForm = ({
  onCancel,
  projectOptions,
  memberOptions,
  initialValues,
}: UpdateTaskFormProps) => {
  const { mutate, isPending } = useUpdateTask();

  const form = useForm<z.infer<typeof upsertTaskFormSchema>>({
    resolver: zodResolver(upsertTaskFormSchema),
    defaultValues: {
      ...initialValues,
      dueDate: initialValues.dueDate
        ? new Date(initialValues.dueDate)
        : undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof upsertTaskFormSchema>) => {
    mutate(
      { json: values, param: { taskId: initialValues.$id } },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.();
        },
      },
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex">
        <CardTitle className="text-xl font-bold">Edit a task</CardTitle>
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
                  <FieldLabel htmlFor="task-name">Enter Task Name</FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    id="task-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter task name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <div
            className="lg:grid grid-cols-2 gap-x-4 
          "
          >
            <FieldGroup>
              <Controller
                name="dueDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="due-date">Due Date</FieldLabel>
                    <DatePicker triggerId="due-date" {...field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                name="assigneeId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="assignee">Assignee</FieldLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="assignee">
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        {memberOptions.map((member) => (
                          <SelectItem key={member.$id} value={member.$id}>
                            <div className="flex items-center gap-x-2">
                              <MemberAvatar
                                className="size-6"
                                name={member.name}
                              />
                              {member.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
          <div className="lg:grid grid-cols-2 gap-x-4">
            <FieldGroup>
              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="status">Status</FieldLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                name="projectId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="project-id">Select project</FieldLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="project-id">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectOptions.map((project) => (
                          <SelectItem key={project.$id} value={project.$id}>
                            <div className="flex items-center gap-x-2">
                              <ProjectAvatar
                                className="size-6"
                                name={project.name}
                                image={project.imageURL}
                              />
                              {project.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
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
  );
};
