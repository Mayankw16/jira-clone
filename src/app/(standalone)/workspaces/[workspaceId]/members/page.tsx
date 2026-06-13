import { redirect } from "next/navigation";

import { getUser } from "@/features/auth/queries";
import { MembersList } from "@/features/workspaces/components/members-list";

interface MembersPageProps {
  params: Promise<{ workspaceId: string }>;
}

const MembersPage = async ({ params }: MembersPageProps) => {
  const user = await getUser();
  if (!user) redirect("/sign-in");

  const { workspaceId } = await params;

  return (
    <div className="w-full lg:max-w-xl">
      <MembersList workspaceId={workspaceId} />
    </div>
  );
};

export default MembersPage;
