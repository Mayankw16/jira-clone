import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$delete"],
  200
>;

type ResquestType = InferRequestType<
  (typeof client.api.projects)[":projectId"]["$delete"]
>;

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, ResquestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.projects[":projectId"]["$delete"]({
        param,
      });

      if (!response.ok) throw new Error("Failed to delete project!");

      return await response.json();
    },

    onSuccess: ({ data }) => {
      toast.success("Project deleted successfully!");

      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: [data.$id] });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
