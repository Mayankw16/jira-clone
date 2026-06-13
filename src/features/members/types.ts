import { Models } from "node-appwrite";

export enum MemberRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export type Member = Models.DefaultRow & {
  workspaceId: string;
  userId: string;
  role: MemberRole;
};
