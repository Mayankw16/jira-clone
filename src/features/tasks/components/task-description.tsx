import { useState } from "react";
import { PencilIcon, XIcon } from "lucide-react";

import { DottedSeparator } from "@/components/dotted-seperator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { PopulatedTask } from "../api/use-get-tasks";
import { useUpdateTask } from "../api/use-update-task";

interface TaskDescriptionProps {
  task: PopulatedTask;
}

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description || "");

  const { mutate, isPending } = useUpdateTask();

  const handleSave = () => {
    mutate(
      { json: { description: value }, param: { taskId: task.$id } },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex item-center justify-between">
        <p className="text-lg font-semibold">Description</p>
        <Button
          onClick={() => setIsEditing((prev) => !prev)}
          variant="secondary"
          size="sm"
        >
          {isEditing ? (
            <XIcon className="size-4 mr-2" />
          ) : (
            <PencilIcon className="size-4 mr-2" />
          )}
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
      <DottedSeparator className="my-4" />
      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            placeholder="Add a description..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isPending}
            className="resize-none h-24"
          />
          <Button
            size="sm"
            className="w-fit ml-auto"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      ) : (
        <div>
          {task.description || (
            <span className="text-muted-foreground">No description set</span>
          )}
        </div>
      )}
    </div>
  );
};
