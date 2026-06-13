import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.members)["$patch"],
  200
>;
type RequestType = InferRequestType<(typeof client.api.members)["$patch"]>;

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.members["$patch"]({ json });

      if (!response.ok) {
        const error = await response.json();

        //Server returned error
        if ("error" in error && typeof error.error === "string")
          throw new Error(error.error);

        // Zod validation error
        if ("success" in error && !error.success)
          throw new Error("Invalid JSON body!");

        throw new Error("Failed to update workspace!");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Role updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return mutation;
};
