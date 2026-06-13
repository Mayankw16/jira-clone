import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$get"],
  200
>;

export type Project = ResponseType["data"];

export const useGetProject = ({ projectId }: { projectId: string }) => {
  const query = useQuery({
    queryKey: ["project", projectId],

    queryFn: async ({}) => {
      const response = await client.api.projects[":projectId"]["$get"]({
        param: { projectId },
      });

      if (!response.ok) throw new Error("Failed to fetch project!");

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
