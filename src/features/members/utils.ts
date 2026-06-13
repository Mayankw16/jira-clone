import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Query, TablesDB } from "node-appwrite";
import { Member } from "./types";

interface GetMemberByIdProps {
  databases: TablesDB;
  memberId: string;
}

interface GetMemberProps {
  databases: TablesDB;
  workspaceId: string;
  userId: string;
}

export const getMemberById = async ({
  databases,
  memberId,
}: GetMemberByIdProps) => {
  const member = await databases.getRow<Member>({
    databaseId: DATABASE_ID,
    tableId: MEMBERS_ID,
    rowId: memberId,
  });

  return member;
};

export const getMember = async ({
  databases,
  workspaceId,
  userId,
}: GetMemberProps) => {
  const members = await databases.listRows<Member>({
    databaseId: DATABASE_ID,
    tableId: MEMBERS_ID,
    queries: [
      Query.equal("workspaceId", workspaceId),
      Query.equal("userId", userId),
    ],
  });

  return members.rows[0];
};
