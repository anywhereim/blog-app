import { CommentsType } from "./comments-type";

export interface Posts {
  id?: string;
  title: string;
  email: string;
  summary: string;
  content: string;
  createAt: string;
  updataAt: string;
  uid: string;
  category?: CategoryType;
  comments?: CommentsType[];
}

export type CategoryType = "Frontend" | "Backend" | "Web" | "Native";
export const CATEGORIES: CategoryType[] = [
  "Frontend",
  "Backend",
  "Web",
  "Native",
];
