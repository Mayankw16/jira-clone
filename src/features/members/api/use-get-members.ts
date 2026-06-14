import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<(typeof client.api.members)["$get"], 200>;
export type Members = ResponseType["data"]["rows"];
export type Member = Members[number];

interface UseGetMembersProps {
  workspaceId: string;
}

export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await client.api.members.$get({
        query: { workspaceId },
      });

      if (!response.ok) throw new Error("Failed to fetch members!");

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
