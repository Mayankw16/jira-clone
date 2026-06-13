import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.projects)["$get"],
  200
>;

export type Projects = ResponseType["data"]["rows"];

export const useGetProjects = ({ workspaceId }: { workspaceId: string }) => {
  const query = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await client.api.projects["$get"]({
        query: { workspaceId },
      });
      if (!response.ok) throw new Error("Failed to fetch projects!");

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
