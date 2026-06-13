import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)["bulk-update"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)["bulk-update"]["$patch"]
>;

export const useBulkUpdateTasks = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks["bulk-update"]["$patch"]({
        json,
      });

      if (!response.ok) throw new Error("Failed to updated tasks!");

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Tasks updated successfully!");
    },
    onError: (error) => toast.error(error.message),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  return mutation;
};
