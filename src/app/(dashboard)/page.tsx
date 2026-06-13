import { redirect } from "next/navigation";

import { getUser } from "@/features/auth/queries";
import { getWorkspaces } from "@/features/workspaces/queries";

export default async function Home() {
  await new Promise((res) => setTimeout(() => res("Intentional delay!"), 5000));

  const user = await getUser();
  if (!user) redirect("/sign-in");

  const workspaces = await getWorkspaces();

  if (workspaces.total === 0) redirect("/workspaces/create");
  else redirect(`/workspaces/${workspaces.rows[0].$id}`);
}
