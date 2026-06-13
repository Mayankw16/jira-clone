import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"],
  200
>;

type ResquestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"]
>;

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, ResquestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"]["$delete"]({
        param,
      });

      if (!response.ok) throw new Error("Failed to delete workspace!");

      return await response.json();
    },

    onSuccess: ({ data }) => {
      toast.success("Workspace deleted successfully!");

      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: [data.$id] });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
