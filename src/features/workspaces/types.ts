import { Models } from "node-appwrite";

export type Workspace = Models.DefaultRow & {
  workspaceId: string;
  name: string;
  imageURL: string;
  inviteCode: string;
  userId: string;
};
