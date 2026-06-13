import { Models } from "node-appwrite";

export type Project = Models.DefaultRow & {
  name: string;
  imageURL: string;
  workspaceId: string;
};
