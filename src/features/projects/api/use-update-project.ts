import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$patch"],
  200
>;

type ResquestType = InferRequestType<
  (typeof client.api.projects)[":projectId"]["$patch"]
>;

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, ResquestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.projects[":projectId"]["$patch"]({
        form,
        param,
      });

      if (!response.ok) throw new Error("Failed to update project!");

      return await response.json();
    },

    onSuccess: ({ data }) => {
      toast.success("Project updated successfully!");

      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["project", data.$id],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
