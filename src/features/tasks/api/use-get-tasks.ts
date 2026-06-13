import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

import { TaskStatus } from "../types";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<(typeof client.api.tasks)["$get"], 200>;

export type PopulatedTasks = ResponseType["data"]["rows"];
export type PopulatedTask = PopulatedTasks[number];

interface UseGetTasksProps {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  search?: string | null;
}

export const useGetTasks = ({
  workspaceId,
  projectId,
  status,
  search,
  assigneeId,
  dueDate,
}: UseGetTasksProps) => {
  const query = useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      projectId,
      assigneeId,
      status,
      search,
      dueDate,
    ],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          assigneeId: assigneeId ?? undefined,
          search: search ?? undefined,
          dueDate: dueDate ?? undefined,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch tasks!");

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
