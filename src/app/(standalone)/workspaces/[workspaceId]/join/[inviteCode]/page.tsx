import { getUser } from "@/features/auth/queries";

import { redirect } from "next/navigation";
import { JoinWorkspaceClient } from "./client";

const JoinWorkspace = async () => {
  const user = getUser();
  if (!user) redirect("/sign-in");

  return <JoinWorkspaceClient />;
};

export default JoinWorkspace;
